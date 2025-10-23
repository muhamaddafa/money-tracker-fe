import { Elysia } from 'elysia'
import { api } from './modules/api'

export const elysiaApp = new Elysia().use(api)

export type TElysiaApp = typeof elysiaApp