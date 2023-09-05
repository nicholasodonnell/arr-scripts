import type { ImportlistMovie, Movie } from './types'

export const movieInList =
  (listId: number) =>
  (movie: ImportlistMovie): boolean => {
    return movie.lists.includes(listId)
  }

export const movieWithTag =
  (tagId: number) =>
  (movie: Movie): boolean => {
    return movie.tags.includes(tagId)
  }

export const maybeFindMovieByTmdbId =
  (movies: Movie[]) =>
  (tmdbId: number): Movie | undefined => {
    return movies.find((movie) => movie.tmdbId === tmdbId)
  }

export const rejectNoFile = (movie: Movie): boolean => {
  return movie.hasFile
}
