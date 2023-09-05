import type { AxiosInstance } from 'axios'
import axios from 'axios'

import type { Importlist, ImportlistMovie, IRadarr, Movie, Tag } from './types'

export class Radarr implements IRadarr {
  private readonly client: AxiosInstance

  constructor(args: { url: string; apiKey: string }) {
    const { apiKey, url } = args

    this.client = axios.create({
      baseURL: url,
      headers: {
        'X-Api-Key': apiKey,
      },
    })
  }

  public async getMovies(): Promise<Movie[]> {
    try {
      const response = await this.client.get<Movie[]>('/api/v3/movie')

      return response.data
    } catch (e: any) {
      const error = new Error(`Failed to get movies: ${e.message}`)

      throw error
    }
  }

  public async getImportists(): Promise<Importlist[]> {
    try {
      const response = await this.client.get<Importlist[]>('/api/v3/importlist')

      return response.data
    } catch (e: any) {
      const error = new Error(`Failed to get import lists: ${e.message}`)

      throw error
    }
  }

  public async getImportlistMovies(): Promise<ImportlistMovie[]> {
    try {
      const response = await this.client.get<ImportlistMovie[]>(
        '/api/v3/importlist/movie',
      )

      return response.data
    } catch (e: any) {
      const error = new Error(`Failed to get import list movies: ${e.message}`)

      throw error
    }
  }

  public async getTags(): Promise<Tag[]> {
    try {
      const response = await this.client.get<Tag[]>('/api/v3/tag')

      return response.data
    } catch (e: any) {
      const error = new Error(`Failed to get tags: ${e.message}`)

      throw error
    }
  }
}
