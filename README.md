# BAC Calculator & Weather App

Aplicación móvil desarrollada con **React Native** y **Expo**, diseñada bajo el patrón de arquitectura **MVVM (Model-View-ViewModel)**. Permite consultar el tipo de cambio oficial del Banco BAC San José en tiempo real, realizar conversiones de divisas bidireccionales con cálculo de recargo, mantener un historial persistente de operaciones y consultar datos del clima.

**Versión:** 1.0.0

---

## Características Principales

* **Autenticación Simulada:** Pantalla de inicio de sesión con validación de campos. **Nota importante:** Actualmente no existe una base de datos de usuarios registrados; se puede ingresar con **cualquier correo y contraseña** siempre que ambos campos contengan texto.
* **Consulta en Tiempo Real:** Consumo de API pública REST para obtener la tasa de cambio de compra y venta del Banco BAC San José.
* **Conversión Bidireccional:** Selector interactivo para alternar entre conversiones:
  * Dólares a Colones (`USD ➔ CRC`)
  * Colones a Dólares (`CRC ➔ USD`)
* **Cálculo con Recargo:** Visualización del monto real calculado según la tasa oficial y del monto con recargo comercial establecido (`BAC + 2`).
* **Gráfica de Tendencia:** Componente visual para seguir la evolución del tipo de cambio.
* **Historial Persistente de Cálculos:**
  * **Botón Show/Hide History:** Permite desplegar u ocultar la lista de operaciones guardadas.
  * **Persistencia Local:** Todos los cálculos se guardan automáticamente en el almacenamiento local del dispositivo (`AsyncStorage`).
  * **Gestión de Registros:** Cada cálculo se presenta en una tarjeta detallada con sus valores y símbolos respectivos, incluyendo un botón individual (`X`) para eliminar registros específicos o la opción de limpiar el historial completo (`Clear All`).
* **Soporte Multi-tema:** Alternancia dinámica entre modo claro y modo oscuro en toda la interfaz.

---

## Arquitectura del Proyecto

El proyecto sigue rigurosamente el patrón **MVVM**:

* `src/models/`: Definición de interfaces TypeScript y contratos de datos (`ExchangeRateResponse`, `CalculationHistoryItem`).
* `src/services/`: Capa de infraestructura encargada del consumo de APIs REST y del manejo del almacenamiento local (`localDatabase` / `AsyncStorage`).
* `src/viewmodels/`: Hooks personalizados (`useCalculatorViewModel`, `useLoginViewModel`) que encapsulan la lógica de negocio, estados y suscripciones asíncronas.
* `app/` y `src/components/`: Capa de vista encargada exclusivamente del renderizado visual y la experiencia de usuario.

---

## Tecnologías Utilizadas

* [React Native](https://reactnative.dev/)
* [Expo](https://expo.dev/) (Expo Go / Expo Router)
* [TypeScript](https://www.typescriptlang.org/)
* [AsyncStorage](https://react-native-async-storage/async-storage) (Persistencia local)
* [Axios / Fetch API](https://developer.mozilla.org/es/docs/Web/API/Fetch_API) (Consumo REST)

---

## Instalación y Ejecución

1. **Instalar las dependencias del proyecto:**

   ```bash
   npm install
