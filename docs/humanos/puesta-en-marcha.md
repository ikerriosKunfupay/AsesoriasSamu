# Puesta en marcha

## Estado actual

El MVP está implementado, validado y publicado en `https://team-ortega.vercel.app`. El proyecto Vercel `team-ortega` usa el repositorio exclusivo `ikerriosKunfupay/AsesoriasSamu`. Supabase está creado en una organización propia, en región europea, con la migración aplicada y las URLs de autenticación configuradas.

La base productiva parte limpia: conserva únicamente la cuenta administradora y los catálogos/configuración general. No quedan cuentas cliente, interesados, cuestionarios, planes asignados, seguimientos, cuotas, notas, avisos ni auditorías de los datos de demostración.

Todavía no deben incorporarse clientes reales: falta completar una prueba real de registro e invitación y sustituir la información legal provisional.

## Lista previa a producción

1. Iniciar sesión con la cuenta inicial designada y comprobar su entrada al panel de administración.
2. Probar el registro público con confirmación de correo y comprobar que la cuenta creada solo recibe el rol `client`.
3. Sustituir el texto provisional de privacidad por la información legal real.
4. Probar invitación, recuperación, aislamiento entre dos clientes y cierre de sesión.
5. Elegir un alojamiento compatible antes del uso comercial. El despliegue actual en Vercel Hobby es gratuito, pero el plan no permite uso comercial.

Ya están completados la organización y el proyecto Supabase exclusivos, la región europea, la migración, las URLs de Auth, las variables protegidas de Vercel, el primer despliegue de `main`, el SMTP personalizado de Brevo Free y la preparación automática del administrador inicial al autenticarse.

## Coste y límites

Para unas 20 personas, Supabase Free tiene capacidad suficiente en condiciones normales, pero puede pausar proyectos con poca actividad y no incluye las garantías del plan de pago. Brevo Free aporta 300 envíos diarios; Team Ortega usa una clave SMTP propia, aunque la cuota y la reputación se comparten con los demás usos de esa cuenta de Brevo.

Los correos de confirmación de alta, verificación del cambio de dirección y recuperación de contraseña usan la identidad visual de Team Ortega, incluyen el emblema alojado en la web y ofrecen tanto un botón como el enlace completo de confirmación. Si se cambian desde Supabase, sus fuentes de referencia deben mantenerse sincronizadas en `supabase/email-templates/`.

La ausencia de pagos dentro de la web no convierte el uso de Vercel en no comercial; el portal apoya un servicio profesional.
