# Rodríguez PlayBit

## Visualizador de frecuencias de audio en tiempo real

Playbit es un visualizador de audio interactivo que analiza las frecuencias de audio en tiempo real utilizando la API [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) del navegador. El sistema procesa el audio del usuario y renderiza una visualización 3D de las frecuencias utilizando WebGL.

## Tecnologías utilizadas

### Three.js
[Three.js](https://github.com/mrdoob/three.js/) es una biblioteca JavaScript ligera para crear y mostrar gráficos 3D en el navegador. Como menciona su creador [Mr. Doob](https://github.com/mrdoob), Three.js está diseñada para ser accesible, manteniendo un bajo nivel de complejidad para facilitar su adopción por desarrolladores web.

### WebGL y AudioContext
- **WebGL**: Proporciona aceleración por hardware para el renderizado 3D en el navegador
- **AudioContext**: API web estándar que permite el análisis, procesamiento y síntesis de audio en tiempo real

## Compatibilidad

La API AudioContext está en fase experimental en algunos navegadores y no es exclusiva de WebKit. Sin embargo, este proyecto está optimizado para Chrome debido a las limitaciones de rendimiento del WebGL canvas en otros navegadores.

## Propósito

> **Playbit es un proyecto educativo que busca familiarizar a los desarrolladores web con las capacidades de audio y gráficos 3D en el navegador, demostrando la integración de tecnologías modernas como WebGL, AudioContext y Three.js.**

## Enlaces

- [Visitar Playbit](http://juanfuent.es/rdz-playbit)
