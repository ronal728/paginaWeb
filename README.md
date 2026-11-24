# Ronal Estudio

Portafolio de Ronal Esteban Figueroa Mora, ingeniero de sistemas de Pasto, Colombia.

El sitio muestra proyectos de ciberseguridad, plataformas web y comunicación digital. Las fotografías son ilustraciones generadas para este portafolio.

## Desarrollo local

Desde la raíz del repositorio, ejecuta `python3 -m http.server 8000 --directory public` y abre <http://localhost:8000>.

El código del sitio está en `public/`. Las fichas de proyectos y el enlace de la lista de Spotify se editan en `public/index.html`. La lista se carga cuando el visitante abre Música.

## Vercel

Importa el repositorio con `main` como rama de producción y la raíz del repositorio como directorio del proyecto. La configuración en `vercel.json` sirve `public/` sin instalar dependencias, compilar ni configurar variables de entorno. El reproductor integrado usa el dominio oficial de Spotify.
