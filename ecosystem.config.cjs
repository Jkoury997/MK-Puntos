module.exports = {
  apps: [
    {
      name: 'PuntosMK', // Nombre de tu aplicación
      script: 'npm', // Ejecutar npm
      args: 'start', // Comando para iniciar la aplicación
      cwd: './', // Directorio de trabajo de tu proyecto Next.js
      interpreter: 'node', // Usa Node.js como intérprete
      env: {
        NODE_ENV: 'production', // Establece el entorno de producción
        PORT: 6000
      },
    },
  ],
};
