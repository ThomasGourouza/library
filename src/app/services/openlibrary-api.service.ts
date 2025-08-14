import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

type OLQuery = {
  title?: string;
  authorName?: string;
  authorKey?: string;
  language?: string;
};

type OLDoc = {
  key?: string;                 // "/works/OL10263W"
  title?: string;
  cover_edition_key?: string;   // "OL7353617M"
  cover_i?: number;             // numeric cover id
  first_publish_year?: number;
  author_name?: string[];
  author_key?: string[];        // ["OL31901A"]
};

type OLWorkDetails = {
  description?: string | { value?: string };
};

type OLEditionsResponse = {
  entries?: Array<{
    title?: string;
    languages?: Array<{ key: string }>;   // "/languages/fre"
  }>;
};

type OLAuthorDetails = {
  birth_date?: string;  // "1904" | "1904-06-29" | "June 29, 1904"
  death_date?: string;
  bio?: string | { value?: string };
};

type MultilingualTitle = { language: string; titles: string[] };

type AuthorInfo = {
  authorName: string | null;
  authorKey: string | null;
  authorPictureUrl: string | null;
  birthDate: Date | null;
  deathDate: Date | null;
  description: string | null;
};

type BookInfo = {
  key: string | null;              // "OL10263W"
  title: string | null;
  publishYear: number | null;

  coverFromKeyUrl: string | null;  // from cover_edition_key
  coverUrl: string | null;         // from cover_i

  description: string | null;      // work description
  multilingualTitles: MultilingualTitle[]; // aggregated from editions

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
  'eng', 'ger', 'rus', 'por', 'ita', 'spa', 'fre', 'jpn'
]);

@Injectable({ providedIn: 'root' })
export class OpenlibraryApiService {
  private readonly http = inject(HttpClient);
  private readonly searchBooksUrl = 'https://openlibrary.org/search.json';

  /** Single-call API that returns a fully shaped BookInfo (no transition type). */
  searchBooks$(oLQuery: OLQuery): Observable<BookInfo | null> {
    let params = new HttpParams()
      .set('limit', '1')
      .set('fields', OL_DOC_FIELDS.join(','));

    if (oLQuery.title)      params = params.set('title', oLQuery.title);
    if (oLQuery.authorName) params = params.set('author', oLQuery.authorName);
    if (oLQuery.authorKey)  params = params.set('author_key', oLQuery.authorKey);
    if (oLQuery.language)   params = params.set('language', oLQuery.language);

    return this.http.get<OLSearchResponse>(this.searchBooksUrl, { params }).pipe(
      map(res => res?.docs?.[0] ?? null),
      switchMap(doc => {
        if (!doc) return of(null);

        const workId   = this.extractWorkId(doc.key);         // "OL10263W"
        const authorId = doc.author_key?.[0] ?? null;          // "OL31901A"

        const coverFromKeyUrl = doc.cover_edition_key
          ? `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-L.jpg?default=false`
          : null;

        const coverUrl = doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg?default=false`
          : null;

        const authorPictureUrl = authorId
          ? `https://covers.openlibrary.org/a/olid/${authorId}-L.jpg?default=false`
          : null;

        const details$ = workId
          ? this.http.get<OLWorkDetails>(`https://openlibrary.org/works/${workId}.json`)
              .pipe(catchError(() => of(null)))
          : of<OLWorkDetails | null>(null);

        const editions$ = workId
          ? this.http.get<OLEditionsResponse>(
              `https://openlibrary.org/works/${workId}/editions.json?limit=1000&fields=title,languages`
            ).pipe(catchError(() => of(null)))
          : of<OLEditionsResponse | null>(null);

        const author$ = authorId
          ? this.http.get<OLAuthorDetails>(`https://openlibrary.org/authors/${authorId}.json`)
              .pipe(catchError(() => of(null)))
          : of<OLAuthorDetails | null>(null);

        return forkJoin({ details: details$, editions: editions$, author: author$ }).pipe(
          map(({ details, editions, author }): BookInfo => ({
            key: workId,
            title: doc.title ?? null,
            publishYear: doc.first_publish_year ?? null,

            coverFromKeyUrl,
            coverUrl,

            description: this.takeMonolingualText(details?.description),
            multilingualTitles: this.buildMultilingualTitles(editions),

            author: {
              authorName: doc.author_name?.[0] ?? null,
              authorKey: authorId,
              authorPictureUrl,
              birthDate: this.parseOpenLibraryDate(author?.birth_date),
              deathDate: this.parseOpenLibraryDate(author?.death_date),
              description: this.takeMonolingualText(author?.bio),
            }
          }))
        );
      }),
      catchError(e => {
        console.error(e);
        return of(null);
      })
    );
  }

  // ============ helpers ============

  private extractWorkId(path?: string): string | null {
    // "/works/OL10263W" -> "OL10263W"
    if (!path) return null;
    const seg = path.split('/').pop();
    return seg ?? null;
  }

  private takeMonolingualText(v?: string | { value?: string } | null): string | null {
    if (v == null) return null;
    return typeof v === 'string' ? v : (v.value ?? null);
  }

  private parseOpenLibraryDate(s?: string | null): Date | null {
    if (!s) return null;
    const trimmed = s.trim();
    if (!trimmed) return null;

    // Year-only like "1904"
    const yearOnly = /^(\d{4})$/.exec(trimmed);
    if (yearOnly) {
      const d = new Date(Number(yearOnly[1]), 0, 1);
      return isNaN(d.getTime()) ? null : d;
    }

    // Try native Date parse for "1904-06-29" or "June 29, 1904"
    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? null : d;
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
    const alias: Record<string, string> = {
      deu: 'ger', // German
      fra: 'fre', // French
    };
    const canonical = alias[c] ?? c;
    return ALLOWED_LANGS.has(canonical) ? canonical : null;
  }

  private buildMultilingualTitles(editions: OLEditionsResponse | null | undefined): MultilingualTitle[] {
    if (!editions?.entries?.length) return [];

    // lang -> (lowercased title -> original title)
    const byLang = new Map<string, Map<string, string>>();

    for (const e of editions.entries) {
      const rawTitle = (e.title ?? '').trim();
      if (!rawTitle) continue;

      const langs = (e.languages ?? [])
        .map(l => this.extractLangCode(l.key))
        .map(code => this.normalizeLanguage(code))
        .filter((c): c is string => !!c);

      if (langs.length === 0) continue;

      for (const lang of langs) {
        if (!byLang.has(lang)) byLang.set(lang, new Map<string, string>());
        const bucket = byLang.get(lang)!;
        const k = rawTitle.toLocaleLowerCase();
        if (!bucket.has(k)) bucket.set(k, rawTitle);
      }
    }

    const result: MultilingualTitle[] = [];
    for (const [language, mapTitles] of byLang.entries()) {
      const titles = Array.from(mapTitles.values()).sort((a, b) => a.localeCompare(b));
      result.push({ language, titles });
    }

    result.sort((a, b) => a.language.localeCompare(b.language));
    return result;
  }
}
