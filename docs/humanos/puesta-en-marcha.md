# Puesta en marcha

## Estado actual

El MVP está implementado y validado localmente. La base de datos está definida como migración reproducible. Quedan decisiones externas necesarias para ponerlo en producción.

## Lista previa a producción

1. Crear una organización y un proyecto Supabase exclusivos de Team Ortega, en región europea.
2. Ejecutar `supabase/migrations/202610120001_initial_schema.sql`.
3. Crear la cuenta inicial del entrenador y promocionarla a `admin` siguiendo el runbook técnico.
4. Conectar un proveedor SMTP gratuito y verificar el remitente.
5. Configurar la URL pública y las redirecciones permitidas en Supabase Auth.
6. Elegir un alojamiento compatible con el uso comercial. Vercel Hobby no lo permite; Vercel Pro sí, pero no es gratuito.
7. Cargar las cuatro variables de Supabase en el alojamiento sin copiarlas a Git.
8. Sustituir el texto provisional de privacidad por la información legal real.
9. Probar invitación, recuperación, aislamiento entre dos clientes y cierre de sesión.

## Coste y límites

Para unas 20 personas, Supabase Free tiene capacidad suficiente en condiciones normales, pero puede pausar proyectos con poca actividad y no incluye las garantías del plan de pago. El SMTP de Supabase no sirve para clientes reales: se necesita un proveedor SMTP propio.

La ausencia de pagos dentro de la web no convierte el uso de Vercel en no comercial; el portal apoya un servicio profesional.
