export interface Experience {
  date: string
  title: string
  company: string
  description: string
  link?: string
}

export const experiences = Object.freeze([
  {
    date: 'Actualmente...',
    title: 'Desarrollador Front-End',
    company: 'Binario Informática',
    description:
      'Responsable de la creación de utilidades y componentes para el desarrollo de aplicaciones web. Mejora significativa de la experiencia de usuario y el rendimiento de aplicaciones web.'
  },
  {
    date: 'Noviembre 2023',
    title: 'Analista de Sistemas, Desarrollador Front-End',
    company: 'CODYS S.A',
    description:
      'Responsable de la planificación de proyectos. Identificación de problemas relacionados con cron-jobs en un sistema de alta demanda en España.'
  },
  {
    date: 'Agosto 2022',
    title: 'Desarrollador Front-End',
    company: 'Freelance',
    description:
      'Principal desarrollador y diseñador de interfaces de usuario. Integración exitosa del sistema con visualización de datos dinámicos en tiempo real desde diferentes dispositivos.'
  }
])
