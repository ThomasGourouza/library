import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';

type OLQuery = {
  title?: string;
  authorName?: string;
  authorKey?: string;
  language?: string;
};
type OLDoc = {
  key?: string;
  title?: string;
  cover_edition_key?: string;
  cover_i?: number;
  first_publish_year?: number;
  author_name?: string[];
  author_key?: string[];
};

type OLWorkDetails = {
  description?: string | { value?: string };
};

type OLEditionsResponse = {
  entries?: Array<{
    title?: string;
    languages?: Array<{ key: string }>;
  }>;
};

type OLAuthorDetails = {
  birth_date?: string;
  death_date?: string;
  bio?: string | { value?: string };
};

type BookInfoTransition = {
  key: string | null;
  title: string | null;
  publishYear: number | null;

  coverFromKeyUrl: string | null;
  coverUrl: string | null;

  details: OLWorkDetails | null;
  editions: OLEditionsResponse | null;

  author: {
    authorName: string | null;
    authorKey: string | null;
    authorPictureUrl: string | null;
    details: OLAuthorDetails | null;
  };
};

type MultilingualTitle = {
  language: string;
  titles: string[];
};

type AuthorInfo = {
  authorName: string | null;
  authorKey: string | null;
  authorPictureUrl: string | null;
  birthDate: Date | null; // was in details: OLAuthorDetails | null;
  deathDate: Date | null; // was in details: OLAuthorDetails | null;
  description: string | null; // was in details: OLAuthorDetails | null;
};

type BookInfo = {
  key: string | null;
  title: string | null;
  publishYear: number | null;

  coverFromKeyUrl: string | null;
  coverUrl: string | null;

  description: string | null; // was details: OLWorkDetails | null;
  multilingualTitles: MultilingualTitle[]; // was editions: OLEditionsResponse | null;

  author: AuthorInfo;
};

type OLSearchResponse = { docs: OLDoc[] };

const OL_DOC_FIELDS = [
  'key',
  'title',
  'cover_edition_key',
  'cover_i',
  'first_publish_year',
  'author_name',
  'author_key',
] as const;

const ALLOWED_LANGS = new Set([
  'eng',
  'ger',
  'rus',
  'por',
  'ita',
  'spa',
  'fre',
  'jpn',
]);

@Injectable({
  providedIn: 'root',
})
export class OpenlibraryApiService {
  private readonly http = inject(HttpClient);
  private readonly searchBooksUrl = 'https://openlibrary.org/search.json';

  searchBooks$(oLQuery: OLQuery): Observable<BookInfo | null> {
    let params = new HttpParams();
    params = params.set('limit', '1');
    params = params.set('fields', OL_DOC_FIELDS.join(','));

    if (oLQuery.title) params = params.set('title', oLQuery.title);
    if (oLQuery.authorName) params = params.set('author', oLQuery.authorName);
    if (oLQuery.authorKey) params = params.set('author_key', oLQuery.authorKey);
    if (oLQuery.language) params = params.set('language', oLQuery.language);

    return this.http
      .get<OLSearchResponse>(this.searchBooksUrl, { params })
      .pipe(
        map((res) => res?.docs?.[0] ?? null),
        switchMap((doc) => {
          if (!doc) return of(null);

          const base = this.mapBookBase(doc);
          const workKey = base.key;
          const authorKey = base.author.authorKey;

          const details$ = workKey
            ? this.http
                .get<OLWorkDetails>(
                  `https://openlibrary.org/works/${workKey}.json`
                )
                .pipe(catchError(() => of(null)))
            : of<OLWorkDetails | null>(null);

          const editions$ = workKey
            ? this.http
                .get<OLEditionsResponse>(
                  `https://openlibrary.org/works/${workKey}/editions.json?limit=1000&fields=title,languages`
                )
                .pipe(catchError(() => of(null)))
            : of<OLEditionsResponse | null>(null);

          const author$ = authorKey
            ? this.http
                .get<OLAuthorDetails>(
                  `https://openlibrary.org/authors/${authorKey}.json`
                )
                .pipe(catchError(() => of(null)))
            : of<OLAuthorDetails | null>(null);

          return forkJoin({
            details: details$,
            editions: editions$,
            authorDetails: author$,
          }).pipe(
            map(
              ({ details, editions, authorDetails }) =>
                ({
                  ...base,
                  details,
                  editions,
                  author: {
                    ...base.author,
                    details: authorDetails,
                  },
                } as BookInfoTransition)
            )
          );
        }),
        map((res) => this.mapToBookInfo(res)),
        catchError((e) => {
          console.error(e);
          return of(null);
        })
      );
  }

  // start
  private takeMonolingualText(
    v?: string | { value?: string } | null
  ): string | null {
    if (v == null) return null;
    return typeof v === 'string' ? v : v.value ?? null;
  }

  private extractLangCode(path?: string): string | null {
    // "/languages/fre" -> "fre"
    if (!path) return null;
    const seg = path.split('/').pop();
    return seg ?? null;
  }

private normalizeLanguage(code?: string | null): string | null {
  if (!code) return null;
  const c = code.trim().toLowerCase();

  // map common ISO-639-2 variants to your canonical codes
  const alias: Record<string, string> = {
    deu: 'ger', // German
    fra: 'fre', // French
  };

  const canonical = alias[c] ?? c;
  return ALLOWED_LANGS.has(canonical) ? canonical : null;
}

private buildMultilingualTitles(
  editions: OLEditionsResponse | null | undefined
): MultilingualTitle[] {
  if (!editions?.entries?.length) return [];

  // lang -> (lowercased title -> original title)
  const byLang = new Map<string, Map<string, string>>();

  for (const e of editions.entries) {
    const rawTitle = (e.title ?? '').trim();
    if (!rawTitle) continue;

    const langs = (e.languages ?? [])
      .map(l => this.extractLangCode(l.key))        // "/languages/fre" -> "fre"
      .map(code => this.normalizeLanguage(code))    // map/validate
      .filter((c): c is string => !!c);             // keep only allowed

    if (langs.length === 0) continue;

    for (const lang of langs) {
      if (!byLang.has(lang)) byLang.set(lang, new Map<string, string>());
      const bucket = byLang.get(lang)!;
      const k = rawTitle.toLocaleLowerCase(); // case-insensitive dedupe
      if (!bucket.has(k)) bucket.set(k, rawTitle);
    }
  }

  // materialize + sort
  const result: MultilingualTitle[] = [];
  for (const [language, mapTitles] of byLang.entries()) {
    const titles = Array.from(mapTitles.values()).sort((a, b) => a.localeCompare(b));
    result.push({ language, titles });
  }

  result.sort((a, b) => a.language.localeCompare(b.language));
  return result;
}


  mapToBookInfo(res: BookInfoTransition | null): BookInfo | null {
    if (!res) return null;

    const description = this.takeMonolingualText(res.details?.description);
    const birthDate = res.author.details?.birth_date
      ? new Date(res.author.details?.birth_date)
      : null;
    const deathDate = res.author.details?.death_date
      ? new Date(res.author.details?.death_date)
      : null;
    const bio = this.takeMonolingualText(res.author.details?.bio);

    const multilingualTitles = this.buildMultilingualTitles(res.editions);

    return {
      key: res.key,
      title: res.title,
      publishYear: res.publishYear,

      coverFromKeyUrl: res.coverFromKeyUrl,
      coverUrl: res.coverUrl,

      description,
      multilingualTitles,

      author: {
        authorName: res.author.authorName,
        authorKey: res.author.authorKey,
        authorPictureUrl: res.author.authorPictureUrl,
        birthDate,
        deathDate,
        description: bio,
      },
    };
  }
  // end

  private mapBookBase(doc: OLDoc): BookInfoTransition {
    const key = doc.key ? doc.key.split('/').pop() ?? null : null;
    const authorKey = doc.author_key?.[0] ?? null;
    return {
      key,
      title: doc.title ?? null,
      publishYear: doc.first_publish_year ?? null,

      coverFromKeyUrl: doc.cover_edition_key
        ? `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-L.jpg?default=false`
        : null,
      coverUrl: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg?default=false`
        : null,

      // will be filled by forkJoin
      details: null,
      editions: null,

      author: {
        authorName: doc.author_name?.[0] ?? null,
        authorKey,
        authorPictureUrl: authorKey
          ? `https://covers.openlibrary.org/a/olid/${authorKey}-L.jpg?default=false`
          : null,
        details: null,
      },
    };
  }
}
