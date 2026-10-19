const es = {
  'app.name': 'Dev Activity Visualizer',
  'app.tagline': 'El informe visual de la actividad de un developer en GitHub.',

  'nav.report': 'Informe',
  'nav.compare': 'Comparar',
  'nav.home': 'Inicio',

  'search.placeholder': 'Usuario de GitHub',
  'search.submit': 'Ver informe',
  'search.aria': 'Buscar un usuario de GitHub',

  'lang.label': 'Idioma',
  'lang.es': 'ES',
  'lang.en': 'EN',

  'token.connect': 'Conectar token',
  'token.connected': 'Token conectado',
  'token.title': 'Token de GitHub (opcional)',
  'token.body':
    'Un token personal de GitHub amplía el informe al año completo de contribuciones y eleva el límite de peticiones. No necesita ningún permiso: los datos que leemos son públicos. El token se guarda solo en este navegador y nunca se envía a un servidor.',
  'token.placeholder': 'ghp_… o github_pat_…',
  'token.save': 'Guardar',
  'token.clear': 'Quitar token',
  'token.privacy': 'Solo en este navegador. Sin servidor de por medio.',

  'rate.label': 'Peticiones',
  'rate.idle': 'Sin uso',

  'report.title': 'Informe de {username}',
  'report.comingSoon': 'El informe se monta en la rama siguiente.',
  'report.contributions': 'Contribuciones · últimos 12 meses',
  'report.languages': 'Lenguajes',
  'report.hours': 'Horas del día',
  'report.streak': 'Racha',
  'report.peakHour': 'Hora pico',
  'report.totalContributions': 'Contribuciones',
  'report.currentStreak': 'Racha actual',
  'report.peakHourValue': 'Pico horario',

  'compare.title': 'Comparar dos developers',
  'compare.placeholderA': 'Primer usuario',
  'compare.placeholderB': 'Segundo usuario',
  'compare.submit': 'Comparar',
  'compare.comingSoon': 'El duelo se monta en la rama de comparación.',

  'home.placeholder': 'Escribe un usuario de GitHub para ver su informe.',
  'home.recent': 'Sin historial todavía: el informe se recuerda en este navegador.',

  'notFound.title': 'Página no encontrada',
  'notFound.body': 'Esa dirección no lleva a ningún informe.',
  'notFound.back': 'Volver al inicio',
} as const

export type TranslationKey = keyof typeof es
export type Dictionary = Record<TranslationKey, string>

const en: Dictionary = {
  'app.name': 'Dev Activity Visualizer',
  'app.tagline': "The visual report of a developer's activity on GitHub.",

  'nav.report': 'Report',
  'nav.compare': 'Compare',
  'nav.home': 'Home',

  'search.placeholder': 'GitHub username',
  'search.submit': 'View report',
  'search.aria': 'Search a GitHub user',

  'lang.label': 'Language',
  'lang.es': 'ES',
  'lang.en': 'EN',

  'token.connect': 'Connect token',
  'token.connected': 'Token connected',
  'token.title': 'GitHub token (optional)',
  'token.body':
    'A GitHub personal token extends the report to the full contribution year and raises the request limit. It needs no permissions: everything we read is public. The token stays in this browser and is never sent to a server.',
  'token.placeholder': 'ghp_… or github_pat_…',
  'token.save': 'Save',
  'token.clear': 'Remove token',
  'token.privacy': 'This browser only. No server involved.',

  'rate.label': 'Requests',
  'rate.idle': 'Idle',

  'report.title': 'Report for {username}',
  'report.comingSoon': 'The report lands in the next branch.',
  'report.contributions': 'Contributions · last 12 months',
  'report.languages': 'Languages',
  'report.hours': 'Hours of the day',
  'report.streak': 'Streak',
  'report.peakHour': 'Peak hour',
  'report.totalContributions': 'Contributions',
  'report.currentStreak': 'Current streak',
  'report.peakHourValue': 'Peak hour',

  'compare.title': 'Compare two developers',
  'compare.placeholderA': 'First user',
  'compare.placeholderB': 'Second user',
  'compare.submit': 'Compare',
  'compare.comingSoon': 'The duel lands in the compare branch.',

  'home.placeholder': 'Type a GitHub username to see their report.',
  'home.recent': 'No history yet: reports are remembered in this browser.',

  'notFound.title': 'Page not found',
  'notFound.body': 'That address leads to no report.',
  'notFound.back': 'Back to start',
}

export const dictionaries: Record<'es' | 'en', Dictionary> = { es, en }
export type Lang = keyof typeof dictionaries
