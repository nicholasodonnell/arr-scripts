import { Logger } from '@arr-scripts/logger'
import type {
  Importlist,
  ImportlistMovie,
  Movie,
  Tag,
} from '@arr-scripts/radarr'
import {
  Radarr,
  maybeFindMovieByTmdbId,
  tagsForList,
  movieInList,
  tagsNotWithMovie,
} from '@arr-scripts/radarr'
import { pick, rejectUndefined } from '@arr-scripts/util'
import { Command, program } from 'commander'

import type { TagarrArgs } from './types'

export const tagarr = async (args: TagarrArgs) => {
  const logger: Logger = new Logger()

  logger.info('================= Starting =================')

  try {
    const { radarrApiKey, radarrUrl } = args

    const radarr: Radarr = new Radarr({
      apiKey: radarrApiKey,
      url: radarrUrl,
    })

    const movies: Movie[] = await radarr.getMovies()
    const tags: Tag[] = await radarr.getTags()
    const importlist: Importlist[] = await radarr.getImportists()
    const importlistMovies: ImportlistMovie[] =
      await radarr.getImportlistMovies()

    for (const list of importlist) {
      const listTags: Tag[] = tags.filter(tagsForList(list))
      const listMovies: Movie[] = importlistMovies
        .filter(movieInList(list.id))
        .map(pick('tmdbId'))
        .map(maybeFindMovieByTmdbId(movies))
        .filter(rejectUndefined<Movie>)

      for (const movie of listMovies) {
        const neededTags: Tag[] = listTags.filter(tagsNotWithMovie(movie))

        if (neededTags.length > 0) {
          await radarr.addTagsToMovie(movie.id, neededTags.map(pick('id')))

          logger.info(
            `Tagged "${movie.title}" with "${neededTags
              .map(pick('label'))
              .join('","')}"`,
          )
        }
      }
    }
  } catch (e) {
    logger.error(`${e}`)

    throw e
  } finally {
    logger.info('================= Finished =================')
  }
}

if (require.main === module) {
  const command: Command = program
    .requiredOption('--radarrUrl <string>', 'Radarr Url')
    .requiredOption('--radarrApiKey <string>', 'Radarr API Key')
    .parse(process.argv)
    .opts()

  tagarr(command as unknown as TagarrArgs)
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
