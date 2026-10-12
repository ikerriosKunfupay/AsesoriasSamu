# Puesta en marcha

## Estado actual

El MVP está implementado, validado y publicado en `https://team-ortega.vercel.app`. El proyecto Vercel `team-ortega` usa el repositorio exclusivo `ikerriosKunfupay/AsesoriasSamu`. Supabase está creado en una organización propia, en región europea, con la migración aplicada y las URLs de autenticación configuradas.

Todavía no deben invitarse clientes reales: falta crear la cuenta administradora del entrenador, cerrar el registro público, conectar un SMTP propio y sustituir la información legal provisional.

## Lista previa a producción

1. Crear la cuenta inicial del entrenador y promocionarla a `admin` siguiendo el runbook técnico.
2. Desactivar el registro público de usuarios; las altas deben proceder únicamente de invitaciones del administrador.
3. Conectar un proveedor SMTP gratuito y verificar el remitente.
4. Sustituir el texto provisional de privacidad por la información legal real.
5. Probar invitación, recuperación, aislamiento entre dos clientes y cierre de sesión.
6. Elegir un alojamiento compatible antes del uso comercial. El despliegue actual en Vercel Hobby es gratuito, pero el plan no permite uso comercial.

Ya están completados la organización y el proyecto Supabase exclusivos, la región europea, la migración, las URLs de Auth, las variables protegidas de Vercel y el primer despliegue de `main`.

## Coste y límites

Para unas 20 personas, Supabase Free tiene capacidad suficiente en condiciones normales, pero puede pausar proyectos con poca actividad y no incluye las garantías del plan de pago. El SMTP de Supabase no sirve para clientes reales: se necesita un proveedor SMTP propio.

La ausencia de pagos dentro de la web no convierte el uso de Vercel en no comercial; el portal apoya un servicio profesional.
