import {
  createDirectoryIfNotExists,
  removeFromDirNotInList,
  symlinkIfNotExists,
} from '@arr-scripts/filesystem'
import type { Permissions } from '@arr-scripts/filesystem'
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
  movieWithTag,
  movieInList,
  rejectNoFile,
} from '@arr-scripts/radarr'
import { pick, rejectUndefined } from '@arr-scripts/util'
import { Command, program } from 'commander'

import type { MirrarrArgs } from './types'

export const mirrarr = async (args: MirrarrArgs) => {
  const logger: Logger = new Logger()

  logger.info('================= Staring =================')

  try {
    const {
      chmod,
      destination: destinationRaw,
      pgid,
      puid,
      radarrApiKey,
      radarrUrl,
    } = args
    const destination = destinationRaw.replace(/\/$/, '')

    const radarr: Radarr = new Radarr({
      apiKey: radarrApiKey,
      url: radarrUrl,
    })

    const permissions: Permissions = {
      chmod: chmod ?? undefined,
      chown: {
        gid: pgid ? Number(pgid) : undefined,
        uid: puid ? Number(puid) : undefined,
      },
    }

    const movies: Movie[] = await radarr.getMovies()
    const tags: Tag[] = await radarr.getTags()
    const importlist: Importlist[] = await radarr.getImportists()
    const importlistMovies: ImportlistMovie[] =
      await radarr.getImportlistMovies()

    // map of mirrored destination directory and movie paths
    const mirroredFolderAndMoviePaths: Record<string, string[]> = {}

    for (const list of importlist) {
      mirroredFolderAndMoviePaths[`lists/${list.name}`] = importlistMovies
        .filter(movieInList(list.id))
        .map(pick('tmdbId'))
        .map(maybeFindMovieByTmdbId(movies))
        .filter(rejectUndefined<Movie>)
        .filter(rejectNoFile)
        .map(pick('path'))
    }

    for (const tag of tags) {
      mirroredFolderAndMoviePaths[`tags/${tag.label}`] = movies
        .filter(movieWithTag(tag.id))
        .filter(rejectNoFile)
        .map(pick('path'))
    }

    const destinationDirs: string[] = []
    for (const [mirroredFolder, moviePaths] of Object.entries(
      mirroredFolderAndMoviePaths,
    )) {
      const destinationDir = `${destination}/${mirroredFolder}`

      // create missing directory
      if (createDirectoryIfNotExists(destinationDir, permissions)) {
        logger.info(`Created "${destinationDir}"`)
      }

      destinationDirs.push(destinationDir)

      const destinationPaths: string[] = []
      for (const moviePath of moviePaths) {
        const destinationPath = `${destinationDir}/${moviePath
          .split('/')
          .pop()}`

        // create symlink
        if (symlinkIfNotExists(moviePath, destinationPath, permissions)) {
          logger.info(`Symlinked "${moviePath}" -> "${destinationPath}"`)
        }

        destinationPaths.push(destinationPath)
      }

      // remove old symlinks
      const removedSymlinks: string[] = removeFromDirNotInList(
        destinationDir,
        destinationPaths,
      )

      for (const removedSymlink of removedSymlinks) {
        logger.info(`Removed "${removedSymlink}"`)
      }
    }

    // remove old lists & tags that no longer exists
    const removedDirs: string[] = ['lists', 'tags'].flatMap((dir) =>
      removeFromDirNotInList(`${destination}/${dir}`, destinationDirs),
    )

    for (const removedDir of removedDirs) {
      logger.info(`Removed "${removedDir}"`)
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
    .requiredOption('--destination <string>', 'Destination directory')
    .requiredOption('--radarrUrl <string>', 'Radarr Url')
    .requiredOption('--radarrApiKey <string>', 'Radarr API Key')
    .option('--chmod <string>', 'Permissions to set on the symlinked movies')
    .option('--puid <string>', 'User ID to set on the symlinked movies')
    .option('--pgid <string>', 'Group ID to set on the symlinked movies')
    .parse(process.argv)
    .opts()

  mirrarr(command as unknown as MirrarrArgs)
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
