-- Catálogo de ejercicios importado del Excel operativo de Team Ortega.
-- Cada plan guarda una copia de nombre, enlace y claves para conservar su histórico.

create table public.exercise_catalog (
  id uuid primary key default gen_random_uuid(),
  source_row integer unique check (source_row is null or source_row > 0),
  source_order integer not null default 0 check (source_order >= 0),
  muscle_order integer not null default 0 check (muscle_order >= 0),
  muscle_group text not null check (char_length(muscle_group) between 2 and 80),
  name text not null check (char_length(name) between 2 and 160),
  reference_url text check (reference_url is null or char_length(reference_url) <= 500),
  cues text not null default '' check (char_length(cues) <= 4000),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index exercise_catalog_browse_idx
on public.exercise_catalog(muscle_order, source_order, name);

create trigger exercise_catalog_updated_at
before update on public.exercise_catalog
for each row execute function public.set_updated_at();

alter table public.exercise_catalog enable row level security;

create policy "exercise_catalog_admin_only"
on public.exercise_catalog for all to authenticated
using (public.is_admin())
with check (public.is_admin());

revoke all on public.exercise_catalog from anon;
grant select, insert, update, delete on public.exercise_catalog to authenticated, service_role;

insert into public.exercise_catalog (
  source_row,
  source_order,
  muscle_order,
  muscle_group,
  name,
  reference_url,
  cues
)
select
  source.source_row,
  source.source_order,
  source.muscle_order,
  source.muscle_group,
  source.name,
  nullif(source.reference_url, ''),
  source.cues
from jsonb_to_recordset($exercise_catalog$[
  {
    "source_row": 3,
    "source_order": 1,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press ligeramente inclinado con mancuernas",
    "reference_url": "https://www.sergiomcoach.com/topics/ejercicio-1-2/",
    "cues": "• Céntrate la trayectoria del húmero al empujar hacia arriba, no en juntar las mancuernas.\n• No hagas un excesivo arco lumbar.\n• No despegues el culo del banco.\n• No cierres excesivamente los codos, busca una posición cómoda entre 60-90º"
  },
  {
    "source_row": 4,
    "source_order": 2,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press inclinado con mancuernas",
    "reference_url": "https://www.sergiomcoach.com/topics/2-press-inclinado-con-mancuernas-2/",
    "cues": "• No hagas un excesivo arco lumbar, lo convertirías en un press plano.\n• No pierdas la verticalidad del movimiento.\n• Alinea la dirección del brazo (húmero) con la de las fibras superiores del pectoral\n• No despegues la cadera del banco."
  },
  {
    "source_row": 5,
    "source_order": 3,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press plano con mancuernas",
    "reference_url": "https://www.sergiomcoach.com/topics/3-press-plano-con-mancuernas-2/",
    "cues": "• Céntrate la trayectoria del húmero al empujar hacia arriba, no en juntar las mancuernas.\n• No hagas un excesivo arco lumbar.\n• No despegues el culo del banco.\n• No cierres excesivamente los codos, busca una posición cómoda entre 60-90º."
  },
  {
    "source_row": 6,
    "source_order": 4,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press declinado con barra",
    "reference_url": "https://www.sergiomcoach.com/topics/4-press-declinado-con-barra-2/",
    "cues": "• No despegues el glúteo del banco.\n• Lleva la barra lo mas vertical posible.\n• No lleves la barra al cuello, si no ligeramente por debajo de los pezones."
  },
  {
    "source_row": 7,
    "source_order": 5,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press declinado con mancuernas",
    "reference_url": "https://www.sergiomcoach.com/topics/5-press-declinado-con-mancuernas-2/",
    "cues": "• No despegues el glúteo del banco.\n• Lleva las mancuernas lo más vertical posible.\n• No lleves las mancuernas al cuello, si no ligeramente por debajo de los pezones."
  },
  {
    "source_row": 8,
    "source_order": 6,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press ligera inclinación en multipower",
    "reference_url": "https://www.sergiomcoach.com/topics/6-press-ligera-inclinacion-en-multipower-2/",
    "cues": "• No hagas un excesivo arco lumbar, ni despegues el culo del asiento.\n• Sitúa una anchura del agarre que te permita alinear verticalmente muñeca y codo en la parte baja del movimiento.\n• Toca la barra con el pecho en cada repetición, eliminando el rebote.\n• A la par que empujas, busca realizar fuerza intencional “uniendo” las manos."
  },
  {
    "source_row": 9,
    "source_order": 7,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press plano en multipower",
    "reference_url": "https://www.sergiomcoach.com/topics/7-press-plano-en-multipower-2/",
    "cues": "• No hagas un excesivo arco lumbar, ni despegues el culo del asiento.\n• Sitúa una anchura del agarre que te permita alinear verticalmente muñeca y codo en la parte baja del movimiento.\n• Toca la barra con el pecho en cada repetición, eliminando el rebote.\n• A la par que empujas, busca realizar fuerza intencional “uniendo” las manos."
  },
  {
    "source_row": 10,
    "source_order": 8,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press press inclinado en multipower",
    "reference_url": "https://www.sergiomcoach.com/topics/8-press-inclinado-en-multipower-2/",
    "cues": "• No hagas un excesivo arco lumbar, ni despegues el culo del asiento.\n• Sitúa una anchura del agarre que te permita alinear verticalmente muñeca y codo en la parte baja del movimiento.\n• Toca la barra con el pecho en cada repetición, eliminando el rebote."
  },
  {
    "source_row": 11,
    "source_order": 9,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press inclinado con barra",
    "reference_url": "https://www.sergiomcoach.com/topics/9-press-inclinado-con-barra-2/",
    "cues": "• No hagas un excesivo arco lumbar, ni despegues el culo del asiento.\n• Sitúa una anchura del agarre que te permita alinear verticalmente muñeca y codo en la parte baja del movimiento.\n• Toca la barra con el pecho en cada repetición, eliminando el rebote."
  },
  {
    "source_row": 12,
    "source_order": 10,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press inverso en multipower",
    "reference_url": "https://www.sergiomcoach.com/topics/10-press-inverso-en-multipower-2/",
    "cues": "• No hagas un excesivo arco lumbar, o directamente puedes no realizarlo.\n• Trata de mantener la muñeca lo más paralela al antebrazo posible.\n• No coloques un peso excesivo, centrate más en el realizar correctamente el movimiento con una correcta cadencia"
  },
  {
    "source_row": 13,
    "source_order": 11,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press cerrado en multipower",
    "reference_url": "https://www.sergiomcoach.com/topics/11-press-cerrado-en-multipower-2/",
    "cues": "• No hagas un excesivo arco lumbar, ni despegues el culo del asiento.\n• Mantén alineada muñeca y antebrazo.\n• Tu codo debe formar un ángulo agudo cuando tengas la barra en el pecho."
  },
  {
    "source_row": 14,
    "source_order": 12,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press cerrado con barra",
    "reference_url": "https://www.sergiomcoach.com/topics/12-press-cerrado-con-barra-2/",
    "cues": "• No hagas un excesivo arco lumbar, ni despegues el culo del asiento.\n• Mantén alineada muñeca y antebrazo.\n• Tu codo debe formar un ángulo agudo cuando tengas la barra en el pecho."
  },
  {
    "source_row": 15,
    "source_order": 13,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Empuje en máquina prono",
    "reference_url": "https://www.sergiomcoach.com/topics/13-empuje-en-maquina-prono-2/",
    "cues": "• Trata de llevar los codos lo más atrás posible, sin perder la tensión en cada repetición. Es mejor si evitas que la máquina choque en los soportes de nuevo.\n• No muevas los pies del suelo ni patalees.\n• Empuja tu cuerpo contra el respaldo mientras alejas las manetas de ti."
  },
  {
    "source_row": 16,
    "source_order": 14,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Cruces en polea sentado",
    "reference_url": "https://www.sergiomcoach.com/topics/14-cruces-en-polea-sentado-2/",
    "cues": "• No te centres en “chocar o unir” las manos, si no en apretar al máximo un pectoral con el otro.\n• Piensa en juntar el bíceps al máximo a la zona lateral del pectoral.\n• Mantén los codos altos, alineando correctamente el cable de la polea con el húmero.\n• Evita balanceos con el torso, saca pecho y mantente estable.\n• Realiza un rango de movimiento lo más completo posible\n• Mantén los codos semiflexionados, ni estirados completamente ni doblados."
  },
  {
    "source_row": 17,
    "source_order": 15,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Cruces en polea de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/15-cruces-en-polea-de-pie-2/",
    "cues": "• No te centres en “chocar o unir” las manos, si no en apretar al máximo un pectoral con el otro.\n• Piensa en juntar el bíceps al máximo a la zona lateral del pectoral.\n• Mantén los codos altos, alineando correctamente el cable de la polea con el húmero.\n• Evita balanceos con el torso, saca pecho y mantente estable.\n• Realiza un rango de movimiento lo más completo posible\n• Mantén los codos semiflexionados, ni estirados completamente ni doblados."
  },
  {
    "source_row": 18,
    "source_order": 16,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Bayesian Flies",
    "reference_url": "https://www.sergiomcoach.com/topics/16-bayesian-flyes-2/",
    "cues": "• No te centres en “chocar o unir” las manos, si no en apretar al máximo un pectoral con el otro, juntando el bíceps al máximo a la zona lateral del pectoral.\n• Mantén los codos altos, alineando correctamente el cable de la polea con el húmero.\n• Realiza un rango de movimiento lo más completo posible.\n• Mantén los codos semiflexionados, ni estirados completamente ni doblados.\n• Mantén los codos altos, alineando correctamente el cable de la polea con el húmero."
  },
  {
    "source_row": 19,
    "source_order": 17,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "High Cable CrossOver",
    "reference_url": "https://www.sergiomcoach.com/topics/17-high-cable-crossover-2/",
    "cues": "• Busca una posición estable sin balanceos del cuerpo.\n• Saca pecho durante el movimiento.\n• Lleva el movimiento “hacia abajo, no hacia delante”.\n• No te centres en juntar las manos, al igual que en otras variantes\n• No estires, ni dobles, del todo los codos. Mantén la tensión en el pectoral."
  },
  {
    "source_row": 20,
    "source_order": 18,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Low Cable Flies",
    "reference_url": "https://www.sergiomcoach.com/topics/18-low-cable-flies-2/",
    "cues": "• Eleva los brazos realizando a la vez un movimiento convergente (elevar + juntar)\n• No es necesario subir por encima de los 90º para trabajar el pectoral, si subes mucho trabajarás el deltoides anterior.\n• Busca una posición estable del torso o realízalo sentado, pero no te balancees."
  },
  {
    "source_row": 21,
    "source_order": 19,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Aperturas en polea en banco inclinado",
    "reference_url": "https://www.sergiomcoach.com/topics/19-aperturas-en-polea-en-banco-inclinado-2/",
    "cues": "• La articulación del codo permanece fija, un error común es flexionar el bíceps en la fase concéntrica y extenderlos quitando tensión al pectoral en la excéntrica.\n• Realiza el gesto de abrazo centrándote en la parte alta del brazo (húmero), no en las manos.\n• Lleva los codos lo más atrás posible, ampliando el ROM activo lo máximo."
  },
  {
    "source_row": 22,
    "source_order": 20,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Aperturas con mancuerna en banco inclinado",
    "reference_url": "https://www.sergiomcoach.com/topics/20-aperturas-con-mancuerna-en-banco-inclinado-2/",
    "cues": "• La articulación del codo permanece fija, un error común es flexionar el bíceps en la fase concéntrica y extenderlos quitando tensión al pectoral en la excéntrica.\n• Realiza el gesto de abrazo centrándote en la parte alta del brazo (húmero), no en las manos.\n• Lleva los codos lo más atrás posible, ampliando el ROM activo lo máximo."
  },
  {
    "source_row": 23,
    "source_order": 21,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Aperturas en polea en banco plano",
    "reference_url": "https://www.sergiomcoach.com/topics/21-aperturas-en-polea-en-banco-plano-2/",
    "cues": "• La articulación del codo permanece fija, un error común es flexionar el bíceps en la fase concéntrica y extenderlos quitando tensión al pectoral en la excéntrica.\n• Realiza el gesto de abrazo centrándote en la parte alta del brazo (bíceps), no en las manos.\n• Lleva los codos lo más atrás posible, ampliando el ROM activo al máximo."
  },
  {
    "source_row": 24,
    "source_order": 22,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Aperturas con mancuerna en banco plano",
    "reference_url": "https://www.sergiomcoach.com/topics/22-aperturas-con-mancuerna-en-banco-plano-2-2/",
    "cues": "• La articulación del codo permanece fija, un error común es flexionar el bíceps en la fase concéntrica y extenderlos quitando tensión al pectoral en la excéntrica.\n• Realiza el gesto de abrazo centrándote en la parte alta del brazo (bíceps), no en las manos.\n• Lleva los codos lo más atrás posible, ampliando el ROM activo al máximo.\n• Evita juntar ambas mancuernas en la parte más alta del movimiento."
  },
  {
    "source_row": 25,
    "source_order": 23,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Pec Fly",
    "reference_url": "https://www.sergiomcoach.com/topics/22-aperturas-con-mancuerna-en-banco-plano-3/",
    "cues": "• La articulación del codo permanece fija, un error común es flexionar el bíceps en la fase concéntrica y extenderlos quitando tensión al pectoral en la excéntrica.\n• Realiza el gesto de abrazo centrándote en la parte alta del brazo (bíceps).\n• Lleva los codos lo más atrás posible, ampliando el ROM activo lo máximo."
  },
  {
    "source_row": 26,
    "source_order": 24,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Fondos en paralelas para pectoral",
    "reference_url": "https://www.sergiomcoach.com/topics/24-fondos-en-paralelas-para-pectoral-2/",
    "cues": "• No te impulses con las piernas ni te balancees\n• Mantén la retracción escapular, y no saques “chepa” durante el ejercicio.\n• Inclínate ligeramente hacia delante\n•Aplica fuerza hacia abajo y adelante, colocando la mano por detrás de la línea del hombro."
  },
  {
    "source_row": 27,
    "source_order": 25,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Fondos en máquina para pectoral",
    "reference_url": "https://www.sergiomcoach.com/topics/25-fondos-en-maquina-para-pectoral-2/",
    "cues": "• Ánclate bien al respaldo o asiento, evitando impulsos innecesarios.\n• Mantén la retracción escapular, y no saques “chepa” durante el ejercicio.\n• Inclínate ligeramente hacia delante.\n• Empuja abajo pero también ligeramente hacia adelante.\n• Tus manos deberían estar ligeramente por detrás de los hombros."
  },
  {
    "source_row": 28,
    "source_order": 26,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Hex Press con mancuernas",
    "reference_url": "https://www.sergiomcoach.com/topics/26-hex-press-con-mancuernas-2/",
    "cues": "•Empuja hacia arriba con ambas mancuernas, a la vez que ejerces fuerza de aducción “juntando” ambas mancuernas una contra la otra.\n• Lleva las mancuernas a la zona media del pecho.\n• No dejes las mancuernas descansar en el pecho, en todo caso realiza tocuh & go."
  },
  {
    "source_row": 29,
    "source_order": 27,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Hex Press en multipower",
    "reference_url": "https://www.sergiomcoach.com/topics/27-hex-press-en-multipower-2/",
    "cues": "• Lleva el agarre a la zona alta del abdomen o zona baja del pecho.\n• Aguantaarribalacontracción haciendo “squeeze” con el pectoral y desciende de forma controlada, evita clavarte el agarre en el pecho.\n• Evita que el agarre quede muy arriba para no llevar el estímulo al tríceps.\n• Puedes realizar agarre suicida si tienes mejores sensaciones, pero cuidado."
  },
  {
    "source_row": 30,
    "source_order": 28,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Aperturas declinadas con mancuerna",
    "reference_url": "https://www.sergiomcoach.com/topics/28-aperturas-declinadas-con-mancuernas-2/",
    "cues": "• La articulación del codo permanece fija, un error común es flexionar el bíceps en la fase concéntrica y extenderlos quitando tensión al pectoral en la excéntrica.\n• Realiza el gesto de abrazo centrándote en la parte alta del brazo (húmero), no en las manos o mancuernas.\n• Lleva los codos lo más atrás posible, ampliando el ROM activo lo máximo."
  },
  {
    "source_row": 31,
    "source_order": 29,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Aperturas declinadas en polea",
    "reference_url": "https://www.sergiomcoach.com/topics/29-aperturas-declinadas-en-polea-baja-2/",
    "cues": "• La articulación del codo permanece fija, un error común es flexionar el bíceps en la fase concéntrica y extenderlos quitando tensión al pectoral en la excéntrica.\n• Realiza el gesto de abrazo centrándote en la parte alta del brazo (húmero), no en las manos.\n• Lleva los codos lo más atrás posible, ampliando el ROM activo lo máximo."
  },
  {
    "source_row": 32,
    "source_order": 30,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press declinado en multipower",
    "reference_url": "https://www.sergiomcoach.com/topics/30-press-declinado-en-multipower-2/",
    "cues": "• No despegues el glúteo o tu cadera del banco\n• Empuja hacia arriba y añade fuerza con la intención de “juntar” tus manos para un mejor estimulo del pectoral.\n• No lleves la barra al cuello, si no ligeramente por debajo de los pezones.\n• Evita movimientos rápidos, desciende y sube de forma controlada."
  },
  {
    "source_row": 33,
    "source_order": 31,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press banca",
    "reference_url": "https://www.sergiomcoach.com/topics/32-press-banca-2/",
    "cues": "• Busca mantener la mano posicionada sobre el codo, ni más abierta ni más cerrada, para llevar el estímulo al pecho, no al tríceps y sin recortar movimiento.\n• Piensa en empujar y juntar las manos a la vez, a modo de fuerza intencional.\n• Evita realizar arco lumbar despegar el culo del asiento o realizar rebote con la barra en el pecho."
  },
  {
    "source_row": 34,
    "source_order": 32,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press lateral en máquina",
    "reference_url": "https://www.sergiomcoach.com/topics/34-press-lateral-en-maquina-2/",
    "cues": "• Piensa en apretar tu bíceps con tu pectoral.\n• Mantén\npies apoyados en el suelo y empújate contra el respaldo.\n• Marca la parte final del recorrido, y resiste la fase excéntrica."
  },
  {
    "source_row": 35,
    "source_order": 33,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press lateral en polea",
    "reference_url": "https://www.sergiomcoach.com/topics/33-press-lateral-en-polea-2/",
    "cues": "• Mantén el torso estable con un buen apoyo de pies.\n• Saca pecho durante todo el recorrido y busca mantener la tensión.\n• Piensa en pegar tu bíceps a tu pectoral y empuja lateralmente hasta la máxima contracción."
  },
  {
    "source_row": 36,
    "source_order": 34,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Standing cable Press",
    "reference_url": "https://www.sergiomcoach.com/topics/35-seated-cable-press-2/",
    "cues": "•Saca pecho ligeramente a la vez que buscas llevar los codos atrás, dando el máximo ROM posible en tu caso.\n• Evita impulsos y balanceos con el cuerpo\n• Piensa en empujar hacia delante y en juntar los bíceps a tus pectorales\n• Recuerda que este ejercicio es un “híbrido” más similar a un press que a unos cruces en polea."
  },
  {
    "source_row": 37,
    "source_order": 35,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Standing cable Press",
    "reference_url": "https://www.sergiomcoach.com/topics/36-standing-cable-press-2/",
    "cues": "• Saca pecho ligeramente, e incluso podrías colocar un foam roller en el banco, a la vez que buscas llevar los codos atrás, dando el máximo ROM posible en tu caso.\n• Piensa en empujar hacia delante y en juntar los bíceps a tus pectorales.\n•Recuerda que este ejercicio es un “híbrido” más similar a un press que a unos cruces en polea sentado."
  },
  {
    "source_row": 38,
    "source_order": 36,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press Declinado en máquina",
    "reference_url": "https://www.sergiomcoach.com/topics/36-press-declinado-en-maquina-2/",
    "cues": "• Empuja al frente, abajo y adentro, mientras lo haces piensa en juntar los bíceps hacia el pecho.\n• Busca llevar los codos lo más atrás posible para darle el máximo ROM al ejercicio.\n• Fija los pies al suelo y empuja con ellos y con tu espalda contra el banco para generar máxima estabilidad."
  },
  {
    "source_row": 39,
    "source_order": 37,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Pec Deck",
    "reference_url": "https://www.sergiomcoach.com/topics/37-peck-deck-2/",
    "cues": "• Mantén el pecho fuera en todo momento.\n• Flexiona los codos en el estiramiento.\n• Extiende los codos en la contracción final.\n• No cargues demasiado peso en este ejercicio."
  },
  {
    "source_row": 40,
    "source_order": 38,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press plano en máquina de palancas",
    "reference_url": "https://www.sergiomcoach.com/topics/38-press-plano-palancas-2/",
    "cues": "• Empuja hacia arriba y hacia dentro, junta tus bíceps a tu pecho a la vez que subes\n• Genera una posición estable, clava los pies en el suelo.\n• Evita realizar un arco lumbar que lleve el estímulo a la porción inferior\n• Dale máxima amplitud al movimiento, de forma fontrolada busca el máximo ROM en estiramiento y extiende por completo los codos en cada repetición."
  },
  {
    "source_row": 41,
    "source_order": 39,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Dumbell Twist Press",
    "reference_url": "https://www.sergiomcoach.com/topics/39-dumbell-twist-press-2/",
    "cues": "• Mantén el foco en acercar tu húmero al pectoral, empujando las mancuernas hacia arriba y no tanto en rotar las muñecas\n• Evita cerrar excesivamente los codos, busca mantener los brazos a 60-90º de abducción\n• Evita manejar cargas excesivamente altas e introduce este ejercicio como calentamiento o pre-activación en caso de querer hacerlo."
  },
  {
    "source_row": 42,
    "source_order": 40,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Cruces en polea en banco inclinado a 60º",
    "reference_url": "https://www.sergiomcoach.com/topics/40-cruces-en-polea-en-banco-inclinado-a-60o-2/",
    "cues": "• Mantén los codos semiflexionados (si eres novato) si eres avanzado puedes flexionarlos durante la fase excéntrica y extenderlos en la concéntrica.\n• Empuja con los pies hacia delante y desciende tus hombros anclándote al banco.\n• Piensa en juntar tus bíceps hacia el pectoral, un error común es centrarse en chocar una mano con otra olvidándose de los húmeros.\n• Realiza una trayectoria desdendente, piensa en llevar tus manos por delante de tu abdomen."
  },
  {
    "source_row": 43,
    "source_order": 41,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press inclinado en máquina sentado",
    "reference_url": "https://www.sergiomcoach.com/topics/41-press-inclinado-sentado-2/",
    "cues": "• Adelanta el glúteo respecto al asiento para mejor alineación del movimiento con el pectoral, no lo dejes pegado atrás.\n• Puedeserinteresanteempezar cada repetición con un empuje muy fuerte en caso de que sea muy difícil la parte final del movimiento.\n• Evita perder tensión en cada repetición, no choques con los soportes.\n• No escojas un agarre ni demasiado amplio ni demasiado estrecho."
  },
  {
    "source_row": 44,
    "source_order": 42,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Empuje en máquina neutro convergente",
    "reference_url": "https://www.sergiomcoach.com/topics/42-empuje-en-maquina-neutro-convergente-2/",
    "cues": "• Flexiona bien los codos durante la excéntrica y extiéndelos durante la concéntrica.\n• Mantén tus hombros descendidos y pegados bien al banco para generar estabilidad mientras empujas al frente con los pies.\n• Junta tus bíceps/húmeros hacia el pectoral a medida que empujas.\n•Busca darle el máximo ROM activo posible, lleva loso codos bien atrás."
  },
  {
    "source_row": 45,
    "source_order": 43,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press plano en máquina sentado",
    "reference_url": "https://www.sergiomcoach.com/topics/43-press-plano-sentado-en-maquina-plate-loaded-2/",
    "cues": "• Puedes extender los codos completamente al ser convergente.\n• Piensa en juntar tus bíceps hacia tu pecho o línea media.\n• Evita rebotar con las palancas entre repeticiones para ayudarte.\n• Empuja con los pies hacia delante, clava y desciende tus hombros en el respaldo."
  },
  {
    "source_row": 46,
    "source_order": 44,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Costal Press around",
    "reference_url": "https://www.sergiomcoach.com/topics/44-costal-press-around-2/",
    "cues": "• Piensa en envolver tu cuerpo con tu bíceps, trayectoria circular o de espiral.\n• Mantén alineado antebrazo y cable en la medida de lo posible.\n• Un erro común es empujar con todo el cuerpo para mover el peso, deja que sea solo el pecho.\n• Sujeta un apoyo con la mano libre para generar mayor estabilidad."
  },
  {
    "source_row": 47,
    "source_order": 45,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Clavicular Press Around",
    "reference_url": "https://www.sergiomcoach.com/topics/45-clavicular-press-around-2/",
    "cues": "• Piensa en empujar al hacia arriba y en envolver tu cuerpo con tu bíceps como si quisieras abrazarte a ti mismo.\n• En la posición final la mano que trabaja queda a la altura de tu cara aproximadamente, pero en línea con el hombro contrario.\n• Busca alinear el cable con tu antebrazo y no perder tensión entre repeticiones.\n• No des saltos con el cuerpo para impulsarte y mover más kgs."
  },
  {
    "source_row": 48,
    "source_order": 46,
    "muscle_order": 1,
    "muscle_group": "PECTORAL",
    "name": "Press en máquina inclinado",
    "reference_url": "https://www.sergiomcoach.com/topics/46-press-inclinado-en-maquina-tumbado-2/",
    "cues": "• Piensa en acercar tus bíceps hacia tu pectoral a medida que empujas\n• No hagas un excesivo arco lumbar ni despegues el glúteo del asiento\n• Empuja tu cuerpo contra el respaldo para generar mayor estabilidad\n• Busca dar profundidad a los codos sin salirte del plano de movimiento para que el pectoral pueda estirarse bien."
  },
  {
    "source_row": 50,
    "source_order": 1,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Dominadas Pronas",
    "reference_url": "https://www.sergiomcoach.com/topics/1-dominadas-pronas-2/",
    "cues": "• Lleva el movimiento entre el plano frontal y sagital, piensa en sacar la barbilla por encima de la barra y en “juntar” tus codos por detrás de tu cuerpo.\n• Evita kiping, impulsos e inercias con tu cuerpo a la hora de realizar el movimiento.\n• Extiendeloscodosporcompleto en cada repetición, controlando la fase excéntrica, pero evita hacer “dead hang”, mantén la tensión.\n• No abras en exceso el agarre, busca una anchura cómoda entre 1,2 a 2 veces el ancho biacromial."
  },
  {
    "source_row": 51,
    "source_order": 2,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Dominadas supinas",
    "reference_url": "https://www.sergiomcoach.com/topics/2-dominadas-supinas-2/",
    "cues": "• Realiza puramente el movimiento en el plano sagital, llevando el codo abajo y atrás\n• Evita kiping, impulsos e inercias con tu cuerpo a la hora de realizar el movimiento\n• Extiende los codos por completo en cada repetición, controlando la fase excéntrica, pero evita hacer “dead hang”, mantén la tensión.\n• No abras en exceso el agarre, busca una anchura cómoda entre 1 a 1,5 veces el ancho biacromial."
  },
  {
    "source_row": 52,
    "source_order": 3,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Dominadas neutras",
    "reference_url": "https://www.sergiomcoach.com/topics/3-dominadas-neutras-2/",
    "cues": "• Realiza puramente el movimiento en el plano sagital, llevando el codo abajo y atrás.\n• Evita kiping, impulsos e inercias con tu cuerpo a la hora de realizar el movimiento.\n• Extiende los codos por completo en cada repetición, controlando la fase excéntrica, pero evita hacer “dead hang”, mantén la tensión.\n• No cierres el agarre en exceso, utiliza aproximadamente la misma anchura que tus hombros (biacromial)."
  },
  {
    "source_row": 53,
    "source_order": 4,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Jalon al pecho prono",
    "reference_url": "https://www.sergiomcoach.com/topics/4-jalon-al-pecho-prono-2/",
    "cues": "• Piensa en “juntar” tus codos por detrás de tu cuerpo, atrás y hacia adentro.\n• Evita impulsos e inercias con tu cuerpo a la hora de realizar el movimiento.\n• Agarre 1,5 veces ancho biacromial suele ser la mejor opción.\n• No es necesario tocar el pecho, puedes tener en cuenta la barbilla como “límite”."
  },
  {
    "source_row": 54,
    "source_order": 5,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Jalon al pecho supino",
    "reference_url": "https://www.sergiomcoach.com/topics/5-jalon-al-pecho-supino-2/",
    "cues": "• Piensa en llevar los codos abajo y hacia atrás, no en flexionarlos.\n• No metas inercias, impulsos ni te tumbes para traccionar de la barra.\n• Saca pecho durante todo el ejercicio, evita “hundirlo”.\n• Puedes dejar, o no, que las escapulas se protraigan siempre que no pierdas tensión, pero esto implicará menos el dorsal y más otros grupos musculares."
  },
  {
    "source_row": 55,
    "source_order": 6,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Jalon al pecho neutro",
    "reference_url": "https://www.sergiomcoach.com/topics/6-jalon-al-pecho-neutro-2/",
    "cues": "• Piensa en llevar los codos abajo y hacia atrás, no en flexionarlos.\n• No metas inercias, impulsos ni te tumbes para traccionar del agarre.\n• Saca pecho durante todo el ejercicio, evita “hundirlo”.\n• Puedes dejar, o no, que las escapulas se protraigan siempre que no pierdas tensión, pero esto implicará menos el dorsal y más otros grupos musculares."
  },
  {
    "source_row": 56,
    "source_order": 7,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Jalon al pecho en banco inclinado a 2 manos",
    "reference_url": "https://www.sergiomcoach.com/topics/7-jalon-al-pecho-en-banco-inclinado-a-2-manos-2/",
    "cues": "• Sitúate estable en el banco, evita que tu pelvis o glúteo se despeguen\n• Alinea el cable y movimiento con la posición de tu cuerpo y banco.\n• Piensa en descender los codos hacia tu cadera, tracciona desde el húmero no pienses en doblar el codo para bajar el agarre."
  },
  {
    "source_row": 57,
    "source_order": 8,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Jalon al pecho unilateral en banco inclinado",
    "reference_url": "https://www.sergiomcoach.com/topics/8-jalon-al-pecho-unilateral-en-banco-inclinado-2/",
    "cues": "• Alinea el cable y movimiento con la posición de tu cuerpo y banco.\n• Piensa en “llevar el codo al bolsillo trasero de tu pantalón”.\n• Sitúate estable en el banco, puedes apoyar la mano libre contra él.\n• Evita pegar tirones del cable e impulsarte, tracciona desde el húmero.\n• Puedes añadir una ligerísima inclinación lateral al movimiento."
  },
  {
    "source_row": 58,
    "source_order": 9,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo con barra Supino",
    "reference_url": "https://www.sergiomcoach.com/topics/9-remo-con-barra-supino-2/",
    "cues": "• Evita realizar un trampeo excesivo, la barra va a tu cuerpo no tu cuerpo hasta la barra. Es posible realizar un ligero impulso, pero no un salto.\n• Céntrate en llevar los codos a tu cadera, evita que se abran en exceso hacia afuera y busca un punto donde guiar siempre la barra. Por ej. tu ombligo.\n• Evita sacar chepa o curvar excesivamente la zona lumbar.\n• Controla la fase excéntrica y estandariza las repeticiones."
  },
  {
    "source_row": 59,
    "source_order": 10,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo gironda alto",
    "reference_url": "https://www.sergiomcoach.com/topics/10-remo-gironda-alto-2/",
    "cues": "• Sitúate estable, a ser posible con el pecho apoyado y evita impulsos.\n• Céntrate en llevar el movimiento dentro del plano transversal.\n• Intenta alinear el cable y agarre con la altura de tus escápulas.\n• Piensa en “juntar” tus escápulas por detrás fuertemente y déjalas libres durante la parte final de la fase excéntrica del movimiento."
  },
  {
    "source_row": 60,
    "source_order": 11,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo gironda",
    "reference_url": "https://www.sergiomcoach.com/topics/11-remo-gironda-2/",
    "cues": "• Evita tirar el cuerpo hacia atrás para impulsarte y mover el cable, no importa “tirar” el agarre hacia atrás si no mover tus codos.\n• Piensa en llevar tus codos hacia la cadera e incluso puedes añadir ligera intención en “juntarlos” por detrás.\n• No es necesario que el codo pase la línea de tu torso en la fase concéntrica, ni que las escapulas se protraigan durante la fase excéntrica."
  },
  {
    "source_row": 61,
    "source_order": 12,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo prono en máquina",
    "reference_url": "https://www.sergiomcoach.com/topics/12-remo-prono-en-maquina-2/",
    "cues": "• No te impulses con el cuerpo despegando el pecho del apoyo.\n• Piensa en juntar fuerte tus escápulas como si quisieras “pillar” una pelota con entre ellas.\n• Llevaloscodoshaciaafuera (abducción de hombro) según comodidad."
  },
  {
    "source_row": 62,
    "source_order": 13,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo neutro en maquina",
    "reference_url": "https://www.sergiomcoach.com/topics/13-remo-neutro-en-maquina-2/",
    "cues": "• Piensa en llevar el codo a la cadera.\n• No es necesario que traspase la línea de tu cuerpo si no estás cómodo con ello y tu objetivo es enfatizar el dorsal ancho.\n• Evita inercias y no te impulses con el cuerpo despegando el pecho del apoyo.\n• Puedes añadir una ligera contracción al final del movimiento."
  },
  {
    "source_row": 63,
    "source_order": 14,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo de pie unilateral en máquina",
    "reference_url": "https://www.sergiomcoach.com/topics/14-remo-de-pie-unilateral-en-maquina-2/",
    "cues": "• Piensa en llevar el codo a la cadera.\n• No es necesario que traspase la línea de tu cuerpo si no estás cómodo con ello y tu objetivo es enfatizar el dorsal ancho.\n• Evita inercias e impulsarte tumbando tu cuerpo hacia atrás."
  },
  {
    "source_row": 64,
    "source_order": 15,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo gironda unilateral",
    "reference_url": "https://www.sergiomcoach.com/topics/15-remo-gironda-unilateral-2/",
    "cues": "• Piensa en llevar tu codo abajo y atrás, hacia tu cadera.\n• Puedes añadir un pequeño gesto de rotación interna al final pese a que no es necesario, en ocasiones puede ayudar a que sientas más el dorsal, si te cuesta.\n• Evita pegar tirones o tumbar tu cuerpo para llevar el cable hacia atrás."
  },
  {
    "source_row": 65,
    "source_order": 16,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Seal Row",
    "reference_url": "https://www.sergiomcoach.com/topics/16-seal-row-con-mancuernas-2/",
    "cues": "• Piensa en llevar tus codos a la cadera y juntarlos ligeramente por detrás.\n• Evita inercias excesivas y tirar con el torso en exceso. Las mancuernas no deben ser péndulos que se muevan balanceando tus hombros.\n• La trayectoria debe ser ligeramente angular estirando el dorsal al final de la excéntrica para después extender el hombro."
  },
  {
    "source_row": 66,
    "source_order": 17,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Bench Cable Row",
    "reference_url": "https://www.sergiomcoach.com/topics/17-bench-cable-row-2/",
    "cues": "• Piensa en llevar tu codo abajo y atrás, hacia tu cadera.\n• Evita pegar tirones o tumbar tu cuerpo para llevar el cable hacia atrás\n• Realiza una ligera supinación con el agarre y usa straps.\n• Puedes añadir un pequeño gesto de rotación interna al final pese a que no es necesario, en ocasiones puede ayudar a que sientas más el dorsal, si te cuesta."
  },
  {
    "source_row": 67,
    "source_order": 18,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Pull Over en polea alta unilateral",
    "reference_url": "https://www.sergiomcoach.com/topics/18-pull-over-en-polea-alta-unilateral-2/",
    "cues": "• Evita extender y flexionar los codos durante el ejercicio, déjalos fijos.\n• Piensa en aplastar tu dorsal ancho con tu tríceps.\n• Extiende el hombro a la vez que añades una ligera rotación e inclinación con el torso.\n• Elige la posición del torso que te sea más cómoda según la parte que quieras trabajar, el brazo se elevará más o menos en función de esta decisión."
  },
  {
    "source_row": 68,
    "source_order": 19,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Pull Over desde polea alta con cuerda",
    "reference_url": "https://www.sergiomcoach.com/topics/19-pull-over-desde-polea-alta-con-cuerda-2/",
    "cues": "• Evita extender y flexionar los codos durante el ejercicio, déjalos fijos.\n• Céntrate en la dirección y extensión de tus hombros.\n• Piensa en aplastar tu dorsal ancho con tu tríceps."
  },
  {
    "source_row": 69,
    "source_order": 20,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo con mancuerna unilateral",
    "reference_url": "https://www.sergiomcoach.com/topics/20-remo-con-mancuerna-unilateral-2/",
    "cues": "• Piensa en llevar tu codo a la cadera.\n• Realiza una trayectoria ligeramente angular, evita excesiva flexión de codo.\n• No “tires” de golpe ni te impulses con el cuerpo como arrancando un cortacésped, imagina que la mancuerna es un “serrucho”.\n• Busca elongar el dorsal alejando la mancuerna de ti en la fase excéntrica."
  },
  {
    "source_row": 70,
    "source_order": 21,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo en banco inclinado desde polea baja",
    "reference_url": "https://www.sergiomcoach.com/topics/21-remo-en-banco-inclinado-desde-polea-baja-2/",
    "cues": "• Piensa en llevar tu codo a la cadera\n• Pega tus tríceps al dorsal y contrae al máximo la espalda.\n• Evita que se te abran hacia afuera los codos, tampoco es necesario que pasen en exceso la línea de tu torso.\n• Mantén tu posición fija y estable, no te muevas."
  },
  {
    "source_row": 71,
    "source_order": 22,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Meadows Row",
    "reference_url": "https://www.sergiomcoach.com/topics/22-meadows-row-2/",
    "cues": "• No lleves el codo hacia la cadera si no hacia el lateral de tu cuerpo, aunque puede apuntar según comodidad ligeramente hacia posterior.\n• Evita que los discos choquen en el suelo, perdiendo tensión.\n• El torso permanece quieto y el movimiento viene del hombro.\n• Controla el movimiento evitando inercias o impulsos."
  },
  {
    "source_row": 72,
    "source_order": 23,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Aducción para dorsal en polea alta",
    "reference_url": "https://www.sergiomcoach.com/topics/23-aduccion-para-dorsal-en-polea-alta-2/",
    "cues": "• Tracciona del cable pensando en llevar el codo a tu cadera, no en tirar de él a base de flexionar el codo.\n• Piensa en pegar el tríceps a tus costillas o dorsal a la vez que bajas el codo a la cadera.\n• Puedes añadir una ligera inclinación del torso hacia el lado de la polea."
  },
  {
    "source_row": 73,
    "source_order": 24,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Jaon al pecho foco espalda alta",
    "reference_url": "https://www.sergiomcoach.com/topics/24-jalon-al-pecho-foco-espalda-alta-2/",
    "cues": "• Utiliza un agarre superior o igual a 2 veces el ancho de tus hombros (biacromial)\n• Piensa en “separar” lateralmente los codos.\n• Céntrate en protraer tus escápulas para después hacer una retracción escapular fuerte, este debe ser el movimiento principal del ejercicio.\n• Añade una ligera inclinación del torso y dirige la barra hacia la línea media del esternón, aunque no es necesario llegar a tocar."
  },
  {
    "source_row": 74,
    "source_order": 25,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo en polea plano transversal",
    "reference_url": "https://www.sergiomcoach.com/topics/25-remo-en-polea-plano-transversal-2/",
    "cues": "• Céntrate en protraer tus escápulas para después hacer una retracción escapular fuerte, este debe ser el movimiento principal del ejercicio.\n• Piensa en “separar” lateralmente los codos.\n• Busca un apoyo estable, a ser posible con un apoyo de pecho.\n• Evita balanceos, inercias o impulsos con el torso, así como despegar el pecho del apoyo para dar sensación de mayor ROM."
  },
  {
    "source_row": 75,
    "source_order": 26,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Jalón unilateral sentado",
    "reference_url": "https://www.sergiomcoach.com/topics/27-jalon-unilateral-sentado-2/",
    "cues": "• Céntrate en llevar tu codo al bolsillo trasero de tu pantalón, tracciona con el húmero evita flexionar en exceso el codo.\n• Piensa en “aplastar” tu dorsal con tu tríceps.\n• Busca darle cierta trayectoria diagonal del cable para alinear el movimiento con tu cuerpo.\n• Puedes añadir también si quieres opcionalmente retroversión pélvica."
  },
  {
    "source_row": 76,
    "source_order": 27,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo gironda agarres independientes",
    "reference_url": "https://www.sergiomcoach.com/topics/28-remo-gironda-agarres-independientes-2/",
    "cues": "• Céntrate en llevar los codos hacia la cadera, no en tirar del agarre flexionando en exceso el codo.\n• Piensa en aplastar con tus tríceps tus dorsales.\n• Evita tumbarte excesivamente hacia atrás o usar impulsos o inercias con el cuerpo, tracciona desde el hombro.\n• No es necesario que tus codos pasen en exceso la línea de tu hombro."
  },
  {
    "source_row": 77,
    "source_order": 28,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Dante Row",
    "reference_url": "https://www.sergiomcoach.com/topics/29-dante-row-2/",
    "cues": "• Céntrate en llevar los codos hacia la cadera, no en tirar del agarre flexionando en exceso el codo.\n• Piensa en aplastar con tus tríceps tus dorsales.\n• No es necesario que tus codos pasen en exceso la línea de tu hombro."
  },
  {
    "source_row": 78,
    "source_order": 29,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Back Boob Pull Down",
    "reference_url": "https://www.sergiomcoach.com/topics/26-back-boob-pull-down-2/",
    "cues": "• Céntrate en protraer tus escápulas para después hacer una retracción escapular fuerte, este debe ser el movimiento principal del ejercicio.\n• Piensa en “separar” lateralmente los codos.\n• Añade una ligera inclinación del torso y selecciona un agarre prono, neutro o mixto entre ambos."
  },
  {
    "source_row": 79,
    "source_order": 30,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo Pendlay",
    "reference_url": "https://www.sergiomcoach.com/topics/30-remo-pendlay-2/",
    "cues": "• Mantén el torso estable durante todo el recorrido, evita un excesivo trampeo pero puedes ayudarte ligeramente.\n• Lleva la barra a la zona del ombligo y enfatiza la extensión de hombro para mayor énfasis al dorsal. O a la zona superior y enfatiza retracción escapular para más énfasis en espalda alta\n• Usa straps y realiza un movimiento controlado, sin tirones."
  },
  {
    "source_row": 80,
    "source_order": 31,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo en multipower",
    "reference_url": "https://www.sergiomcoach.com/topics/31-remo-en-multipower-2/",
    "cues": "• Piensa en separar un codo de otro lateralmente y hacer una retracción escapular fuerte.\n• No tiene qué ser un movimiento puro en el plano transversal, los codos pueden ir ligeramente hacia abajo.\n• Evita grandes impulsos con tu cuerpo, realiza repeticiones controladas, con una protracción y retracción escapular lo más completas posibles."
  },
  {
    "source_row": 81,
    "source_order": 32,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo en punta",
    "reference_url": "https://www.sergiomcoach.com/topics/32-remo-en-punta-2/",
    "cues": "• Acompaña ligeramente con tu cuerpo el movimiento de los discos.\n• No pegues un fuerte tirón inicial puesto que las fuerzas inerciales harán la parte más fácil de recorrido, realiza un movimiento controlado.\n• Controla la fase excéntrica, no dejes caer los brazos “muertos”.\n• Piensa en llevar los codos hacia la cadera."
  },
  {
    "source_row": 82,
    "source_order": 33,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo en T",
    "reference_url": "https://www.sergiomcoach.com/topics/33-remo-en-t-2/",
    "cues": "• Mantén buena técnica, evita despegar en exceso el pecho del apoyo\n• No pegues un fuerte tirón inicial puesto que las fuerzas inerciales harán la parte más fácil de recorrido, realiza un movimiento controlado.\n• Controla la fase excéntrica, no dejes caer los brazos “muertos”\n• En caso de énfasis en espalda alta, protráe y retráe las escápulas como movimiento principal, llevando los codos abiertos.\n• En caso de énfasis en dorsal lleva los codos hacia la cadera con un agarre neutro."
  },
  {
    "source_row": 83,
    "source_order": 34,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Single Arm Landmine Row",
    "reference_url": "https://www.sergiomcoach.com/topics/34-single-arm-landmine-row-2/",
    "cues": "• Piensa en llevar el codo abajo y atrás, hacia tu cadera.\n• Evita flexionar el codo en exceso, céntrate en la extensión de hombro no en la flexión de codo.\n• No es necesario que el codo traspase la línea de tu torso.\n• Lleva ligeramente tu cadera hacia atrás para mayor estabilidad."
  },
  {
    "source_row": 84,
    "source_order": 35,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Incline bench Dumbell Row",
    "reference_url": "https://www.sergiomcoach.com/topics/35-incline-bench-dumbell-row-2/",
    "cues": "• Céntrate y piensa en juntar lo más fuerte posible una escápula con la otra, como si quisieras atrapar y sujetar un lápiz en medio de ambas.\n• Lleva los codos hacia afuera, buscando amplitud y separarlos a lo ancho.\n• Aguanta la contracción al final y desciende de forma controlada.\n• No pegues tirones con el cuello, mantenlo neutro mirando al suelo."
  },
  {
    "source_row": 85,
    "source_order": 36,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo con mancuernas Torso inclinado",
    "reference_url": "https://www.sergiomcoach.com/topics/36-remo-con-mancuernas-torso-inclinado-2/",
    "cues": "• Crea un apoyo de pies que sea una base sólida para traccionar.\n• No trampees excesivamente añadiendo impulsos con tu cuerpo.\n• Recuerda que si tu foco es la espalda alta debes centrar el movimiento en la protracción y retracción escapular en el plano transversal. Si es el dorsal ancho, en la extensión del hombro llevando los codos a las caderas."
  },
  {
    "source_row": 86,
    "source_order": 37,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Jaon unilateral en máquina",
    "reference_url": "https://www.sergiomcoach.com/topics/37-jalon-unilateral-en-maquina-2/",
    "cues": "• Piensa en llevar tu codo al bolsillo trasero de tu pantalón o cadera.\n• Aplasta tu dorsal con tu tríceps a medida que desciendes el húmero.\n• Usa un agarre semi-supino, puedes añadir un agarre “D” a la maneta.\n• Busca un movimiento puro en el plano sagital de extensión de hombro."
  },
  {
    "source_row": 87,
    "source_order": 38,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Pull Over sentado",
    "reference_url": "https://www.sergiomcoach.com/topics/38-pull-over-sentado-2/",
    "cues": "• Evita extender o flexionar los codos durante el ejercicio, déjalos fijos.\n• Céntrate en la dirección y extensión de tus hombros\n• Piensa en aplastar tus dorsales con tus tríceps.\n• No es necesario subir los brazos más allá de 120-130º de flexión de hombro."
  },
  {
    "source_row": 88,
    "source_order": 39,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Pull Over en máquina",
    "reference_url": "https://www.sergiomcoach.com/topics/39-pull-over-en-maquina-2/",
    "cues": "• Piensa en empujar con tus tríceps contra las almohadillas hasta llevarlos a los codos mientras tratas de acercarlos a tus dorsales.\n• Evita usar fuerzas inerciales, no pegues un tirón fuerte inicial.\n• Busca el máximo ROM activo posible durante el ejercicio."
  },
  {
    "source_row": 89,
    "source_order": 40,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Seal Row con barra",
    "reference_url": "https://www.sergiomcoach.com/topics/40-seal-row-con-barra-2/",
    "cues": "• Mantén el pecho apoyado y sácalo ligeramente al final de cada repetición.\n• Piensa en llevar los codos a la cadera y apretar los tríceps contra tus costillas.\n• Traza una trayectoria pendular, si el objetivo si el dorsal ancho."
  },
  {
    "source_row": 90,
    "source_order": 41,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Helms Row",
    "reference_url": "https://www.sergiomcoach.com/topics/41-helms-row-2/",
    "cues": "• Piensa en llevar tus codos hacia tus caderas, con una ligera trayectoria angular.\n• Evita flexionar en exceso los codos.\n• Piensa en pegar tus tríceps a tu dorsal a medida que extiendes el hombro."
  },
  {
    "source_row": 91,
    "source_order": 42,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Rack Pulls",
    "reference_url": "https://www.sergiomcoach.com/topics/42-rack-pull-2/",
    "cues": "• Piensa en subir manteniendo la espalda apretada y juntando fuerte ambas escápulas.\n• Evita realizar una hiperextensión excesiva llevando los hombros hacia atrás.\n• Mantén la barra constantemente pegada a ti y dorsal apretado cerrando axilas."
  },
  {
    "source_row": 92,
    "source_order": 43,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo prono en máquina Plate loaded",
    "reference_url": "https://www.sergiomcoach.com/topics/43-remo-prono-en-maquina-plate-loaded-2/",
    "cues": "• Sitúa el glúteo ligeramente por detrás de tus hombros.\n• Piensa en juntar y retraer tus escápulas como si quisieras atrapar un lápiz entre ambas.\n• Intenta mantener aproximadamente los codos a la altura de los hombros, pueden descenderse ligeramente pero intenta mantener un movimiento en el plano “horizontal”."
  },
  {
    "source_row": 93,
    "source_order": 44,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Low Row énfasis espalda alta",
    "reference_url": "https://www.sergiomcoach.com/topics/44-low-row-enfasis-espalda-alta-2/",
    "cues": "• Lleva tus codos hacia fuera y a los lados, no abajo y a la cadera.\n• Piensa que tienes un lápiz entre ambas escápulas y debes atraparlo con ellas.\n• Deja ir completamente las escápulas, elonga todo lo que puedas la musculatura escapular.\n• Mantén la cadera ligeramente más atrasada que los hombros."
  },
  {
    "source_row": 94,
    "source_order": 45,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo Kroc",
    "reference_url": "https://www.sergiomcoach.com/topics/45-remo-kroc-2/",
    "cues": "• Coloca la mano libre en un banco o apoyo que te genere estabilidad.\n• Saca el codo hacia afuera, lateralmente. NO lo lleves hacia la cadera.\n• Piensa en llevar la escápula que trabaja a tocar la otra."
  },
  {
    "source_row": 95,
    "source_order": 46,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Retracciones Escapulares en polea",
    "reference_url": "https://www.sergiomcoach.com/topics/45-retracciones-escapulares-en-polea-2/",
    "cues": "• Piensa en juntar ambas escápulas como si quisieras atrapar un lápiz entre ambas.\n• Desciende ambas escápulas hacia tu cadera mientras que las juntas, piensa en “guardarlas” en el bolsillo de atrás de un pantalón.\n• Utilizastrapsparaqueelagarre nunca sea el limitante.\n• Deja ir las escápulas todo lo que puedas, elongando la musculatura y “sacando chepa” antes de retraer."
  },
  {
    "source_row": 96,
    "source_order": 47,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Low Row unilateral de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/47-low-row-unilateral-de-pie-2/",
    "cues": "• Clava bien la rodilla sobre el asiento y estabiliza con la mano libre contra el acolchado.\n• Orienta tu torso hacia el lado que trabaja para mejor alineación.\n• Piensa en llevar el codo hacia la cadera no es necesario que lo llevés más allá.\n• Intenta no pegar tirones o flexionar excesivamente el codo."
  },
  {
    "source_row": 97,
    "source_order": 48,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Low Row énfasis en dorsal ancho",
    "reference_url": "https://www.sergiomcoach.com/topics/48-low-row-sentado-enfasis-en-dorsal-ancho-2/",
    "cues": "• Piensa en llevar los codos hacia tu cadera, manteniendo los hombros descendidos.\n• Agarra las manetas por el punto más bajo preferiblemente usando straps.\n• Mete la cadera hacia dentro al sentarte, pues añadir ligera retroversión.\n• Evita trampear con el torso, no pegues tirones."
  },
  {
    "source_row": 98,
    "source_order": 49,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Jalón al pecho Half Kneeling",
    "reference_url": "https://www.sergiomcoach.com/topics/49-jalon-al-pecho-half-kneeling-unilateral-2/",
    "cues": "• Mantén un agarre semi-supino o neutro, no gires la mano.\n• Piensa en llevar tu codo hacia tu cadera y en pegar el tríceps a tus costillas.\n• No es necesario flexionar el hombro hasta arriba, descolgando la escápula. Sube hasta unos 120-130º de flexión de hombro o hasta que el bíceps esté a la altura de tu cara."
  },
  {
    "source_row": 99,
    "source_order": 50,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Single Arm Multipower Row",
    "reference_url": "https://www.sergiomcoach.com/topics/50-single-arm-multipower-row-2/",
    "cues": "• Evita impulsarte con las piernas o cuerpo para elevar la barra\n• Lleva el codo a la cadera, no es necesario que lo lleves lo más atrás que puedas.\n• No descuelgues la escápula al final de cada fase excéntrica, mantén tensión.\n• Uitliza straps, y puedes aplicar un agarre con el pulgar sobre la barra tipo pistol, sin rodear si sientes mucha tensión en el bíceps."
  },
  {
    "source_row": 100,
    "source_order": 51,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Aducciones para dorsal ancho en máquina",
    "reference_url": "https://www.sergiomcoach.com/topics/51-aducciones-para-dorsal-ancho-en-maquina-2/",
    "cues": "• Piensa en pegar tus tríceps a tus costillas todo lo que puedas.\n• Realiza el movimiento dentro de un plano frontal, no dejes que los codos se vayan muy atrás o adelante.\n• Evita pegar un tirón fuerte al inicio, realiza."
  },
  {
    "source_row": 101,
    "source_order": 52,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Kassem Pull Down",
    "reference_url": "https://www.sergiomcoach.com/topics/52-kassem-pull-down-2/",
    "cues": "• Utiliza un agarre neutro o semi-supino y no lo muevas ni rotes la muñeca durante el movimiento.\n• Busca que antebrazo-cable y mano estén alineados durante todo el movimiento. Un error común es situar el antebrazo paralelo al suelo al final de la fase concéntrica mientras que el cable baja diagonal.\n• Empuja con la mano libre contra el respaldo y clava bien la rodilla en el asiento.\n• Flexiona el hombro hasta unos 120130º, una vez tu brazo esté a la altura de tu cara aproximadamente tracciona de nuevo realizando otra repetición."
  },
  {
    "source_row": 102,
    "source_order": 53,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo con barra prono",
    "reference_url": "https://www.sergiomcoach.com/topics/53-remo-con-barra-prono-bent-over-row-2/",
    "cues": "• Evita realizar un trampeo excesivo con el cuerpo, un ligero acompañamiento es correcto al final de la fase concéntrica pero evitando impulsos y tirones agresivos\n• Centra el movimiento en llevar tus codos hacia la cadera\n• Resiste y controla la fase excéntrica no dejes caer el peso de golpe\n• No rebotes ni choques los discos con el suelo, mantén tensión constante.\n• Utiliza straps o agarraderas para que el agarre no sea un limitante"
  },
  {
    "source_row": 103,
    "source_order": 54,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo con trap Bar",
    "reference_url": "https://www.sergiomcoach.com/topics/54-remo-con-trap-bar-2/",
    "cues": "• Evita realizar un trampeo excesivo con el cuerpo\n• Sujeta las agarraderas de la Trap Bar en su punto más alto para que se incline ligeramente hacia abajo y favorecer la extensión de hombro\n• Mantén el torso inclinado, prácticamente paralelo al suelo de forma similar a un remo pendlay"
  },
  {
    "source_row": 104,
    "source_order": 55,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo pendular énfasis en dorsal ancho",
    "reference_url": "https://www.sergiomcoach.com/topics/55-remo-pendular-enfasis-en-dorsal-ancho-2/",
    "cues": "• Piensa en llevar los codos hacia la cadera\n• Utiliza un agarre neutro o supino y straps o agarraderas\n• Evita balanceos o impulsos excesivos con el cuerpo, si te aprovechas en exceso utiliza un banco para limitar la tracción al hombro.\n• Piensa en tirar desde el codo, no desde la mano ni en mover la máxima carga posible."
  },
  {
    "source_row": 105,
    "source_order": 56,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Remo pendular énfasis espalda alta",
    "reference_url": "https://www.sergiomcoach.com/topics/56-remo-pendular-enfasis-en-espalda-alta-2/",
    "cues": "• Deja ir completamente tus escápulas redondeando tu espalda alta\n• Tracciona llevando los codos abiertos entre unos 50 y 70º de apertura despecto a tu torso\n• Piensa en juntar fuertemente y retraer tus escápulas además de en separar un codo de otro lateralmente.\n• Realiza un movimiento controlado, sin impulsos con el torso o tirones excesivamente fuertes de la carga."
  },
  {
    "source_row": 106,
    "source_order": 57,
    "muscle_order": 2,
    "muscle_group": "ESPALDA",
    "name": "Extensiones lumbares en máquina",
    "reference_url": "https://www.sergiomcoach.com/topics/extension-lumbar-en-maquina/",
    "cues": "• Realiza un ROM y movimiento controlados, no pegues un tirón fuerte al inicio\n• Evita curvar en exceso la zona lumbar no es ese el objetivo si no empujar hacia atrás realizando una extensión del tronco que parta desde la cadera.\n• Centra el movimiento en la cadera, manteniendo la columna dentro de un rango neutro."
  },
  {
    "source_row": 108,
    "source_order": 1,
    "muscle_order": 3,
    "muscle_group": "TRAPECIO",
    "name": "Encogimientos con mancuernas de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/1-encogimientos-con-mancuernas-de-pie-2/",
    "cues": "• Realiza una abducción de unos 20-35o, separando de tu cuerpo las mancuernas.\n• Céntrate en realizar una rotación de la escápula, en lugar de únicamente “subir” las mancuernas, ambos movimientos son claves para una buena técnica.\n• Piensa en acercar el hombro a la oreja, no en “levantar las mancuernas”."
  },
  {
    "source_row": 109,
    "source_order": 2,
    "muscle_order": 3,
    "muscle_group": "TRAPECIO",
    "name": "Encogimientos con barra de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/2-encogimientos-con-barra-de-pie-2/",
    "cues": "• Escoge un agarre ancho, realizando una abducción de unos 20-35o.\n• Céntrate en realizar una rotación de la escápula, en lugar de únicamente “subir” las mancuernas, ambos movimientos son claves para una buena técnica.\n• Piensa en acercar el hombro a la oreja, no en “levantar la barra verticalmente”."
  },
  {
    "source_row": 110,
    "source_order": 3,
    "muscle_order": 3,
    "muscle_group": "TRAPECIO",
    "name": "Encogimientos en polea de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/3-encogimientos-en-polea-de-pie-2/",
    "cues": "• Realiza una abducción de unos 25-45o, puedes elevar la altura de la polea para facilitar el gesto si lo ves necesario.\n• Céntrate en realizar una rotación de la escápula, en lugar de únicamente “subir” las mancuernas, ambos movimientos son claves para una buena técnica.\n• Piensa en acercar el hombro a la oreja, girando tus escápulas como si fueran engranajes, a la vez que elevas los agarres."
  },
  {
    "source_row": 111,
    "source_order": 4,
    "muscle_order": 3,
    "muscle_group": "TRAPECIO",
    "name": "Encogimientos en máquina de press",
    "reference_url": "https://www.sergiomcoach.com/topics/4-encogimientos-en-maquina-de-press-2/",
    "cues": "• Realiza una abducción de unos 2545o, puedes elevar la altura de la polea para facilitar el gesto si lo ves necesario.\n• Céntrate en realizar una rotación de la escápula, en lugar de únicamente “subir” las mancuernas, ambos movimientos son claves para una buena técnica.\n• Piensa en acercar el hombro a la oreja, girando tus escápulas como si fueran engranajes, a la vez que elevas los agarres."
  },
  {
    "source_row": 112,
    "source_order": 5,
    "muscle_order": 3,
    "muscle_group": "TRAPECIO",
    "name": "Encogimientos tumbado en banco inclinado",
    "reference_url": "https://www.sergiomcoach.com/topics/5-encogimientos-tumbado-en-banco-inclinado-2/",
    "cues": "• Realiza una abducción de unos 15-30º, separando de tu cuerpo las mancuernas.\n• Céntrate en realizar una rotación de la escápula, en lugar de únicamente “subir” las mancuernas, ambos movimientos son claves para una buena técnica.\n• Piensa en acercar el hombro a la oreja, no en “levantar las mancuernas” rotando las escápulas como si fueran engranajes, en oposición."
  },
  {
    "source_row": 113,
    "source_order": 6,
    "muscle_order": 3,
    "muscle_group": "TRAPECIO",
    "name": "Encogimientos para trapecio en banco inclinado",
    "reference_url": "https://www.sergiomcoach.com/topics/6-encogimientos-para-trapecio-en-banco-inclinado-2/",
    "cues": "• Piensa en acercar tus hombros hacia tus orejas.\n• Rota tus escápulas como si fueran engranajes, intenta “envolver” tus hombros con ellas. Puedes doblar ligeramente los codos.\n• Aguanta la contracción y desciende de forma controlada, resiste la excéntrica."
  },
  {
    "source_row": 114,
    "source_order": 7,
    "muscle_order": 3,
    "muscle_group": "TRAPECIO",
    "name": "Encogimientos para trapecio en multipower",
    "reference_url": "https://www.sergiomcoach.com/topics/7-encogimientos-para-trapecio-en-multipower-wide-grip-2/",
    "cues": "• Centra el movimiento en rotar tus escápulas hacia arriba (rotación ascendente de la escápula) envolviendo tus hombros con ellas por fuera.\n• Piensa en acercar tus hombros hacia tus orejas y en girar como engranajes tus escápulas.\n• Escoge un agarre amplio y además puedes muy ligeramente flexionar los codos."
  },
  {
    "source_row": 115,
    "source_order": 8,
    "muscle_order": 3,
    "muscle_group": "TRAPECIO",
    "name": "Encogimientos con trap bar",
    "reference_url": "https://www.sergiomcoach.com/topics/8-encogimientos-con-trap-bar-2/",
    "cues": "• Piensa en llevar tus hombros hacia tus oreja\n• Imagina que tus escapulas son engranajes que deben rotar sobre si mismas a la vez que ascienden (rotación ascendente de la escápula)\n• No hay problema en doblar los codos ligeramente al subir y rotar escápulas.\n• Inclina el torso hacia delante para una mejor alineación del movimiento"
  },
  {
    "source_row": 116,
    "source_order": 9,
    "muscle_order": 3,
    "muscle_group": "TRAPECIO",
    "name": "Encogimientos para trapecio en polea a 1 mano",
    "reference_url": "https://www.sergiomcoach.com/topics/9-encogimientos-para-trapecio-en-polea-a-1-mano-2/",
    "cues": "• Piensa en acercar el hombro a tu oreja, no en tirar del cable con la mano.\n• Puedes doblar el codo a medida que subes para un mayor ROM activo.\n• Centra el movimiento en la rotación ascendente de la escápula, sube y rota como un engranaje.\n• Mantén el torso flexionado ligeramente hacia delante para mejor alineación."
  },
  {
    "source_row": 117,
    "source_order": 10,
    "muscle_order": 3,
    "muscle_group": "TRAPECIO",
    "name": "Farmer Walks",
    "reference_url": "https://www.sergiomcoach.com/topics/10-farmer-walks-con-trap-bar-2/",
    "cues": "• Utiliza un agarre más o menos grueso según quieras trabajar el agarre\n• Puedes doblar ligeramente los codos y ascender las escápulas manteniendo isométricamente la posición para mayor trabajo de trapecio\n• Deja la carga en el suelo para cambiar de dirección."
  },
  {
    "source_row": 119,
    "source_order": 1,
    "muscle_order": 4,
    "muscle_group": "DELTOIDES POSTERIOR",
    "name": "Pájaros con mancuerna de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/1-pajaros-con-mancuerna-de-pie-2/",
    "cues": "• Selecciona preferiblemente un agarre prono, y busca un apoyo estable.\n• Piensa en separar las mancuernas y tus codos entre sí a lo ancho, no en juntar por detrás.\n• Busca una trayectoria horizontal o ligeramente descendente\n• Evita impulsos con tu torso y cadera"
  },
  {
    "source_row": 120,
    "source_order": 2,
    "muscle_order": 4,
    "muscle_group": "DELTOIDES POSTERIOR",
    "name": "Pájaros desde polea baja a 2 manos",
    "reference_url": "https://www.sergiomcoach.com/topics/2-pajaros-desde-polea-baja-a-2-manos-2/",
    "cues": "• Piensa en separar los codos y agarres entre sí, a lo ancho, no en tirar hacia atrás\n• Busca mantener tensión constante en el cable\n• Puedes añadir una trayectoria ligeramente descendente\n• Evita balanceos y ayudas con tu cuerpo y cadera"
  },
  {
    "source_row": 121,
    "source_order": 3,
    "muscle_order": 4,
    "muscle_group": "DELTOIDES POSTERIOR",
    "name": "Pájaros con mancuernas en banco inclinado",
    "reference_url": "https://www.sergiomcoach.com/topics/3-pajaros-con-mancuernas-en-banco-inclinado-2/",
    "cues": "• Selecciona preferiblemente un agarre prono, y busca un apoyo estable.\n• Piensa en separar las mancuernas y tus codos entre sí a lo ancho, no en juntar por detrás.\n• Busca una trayectoria horizontal o ligeramente descendente.\n• Evita impulsos con tu torso y cadera."
  },
  {
    "source_row": 122,
    "source_order": 4,
    "muscle_order": 4,
    "muscle_group": "DELTOIDES POSTERIOR",
    "name": "Reverse Cable Cross",
    "reference_url": "https://www.sergiomcoach.com/topics/4-reverse-cable-cross-2/",
    "cues": "• Busca mantener alineados mano-codo-hombro durante el recorrido\n• Piensa en alejar tus manos en horizontal respecto a la línea media de tu cuerpo\n• Clava el codo al final del movimiento, pero no es necesario sobrepasar en exceso por detrás la línea de tu torso, evita perder tensión en cualquier parte del ROM.\n• Mantén el codo fijo y semiflexionado, evita que se extienda y flexione."
  },
  {
    "source_row": 123,
    "source_order": 5,
    "muscle_order": 4,
    "muscle_group": "DELTOIDES POSTERIOR",
    "name": "Abducción unilatleral en polea",
    "reference_url": "https://www.sergiomcoach.com/topics/5-abduccion-unilateral-en-polea-2/",
    "cues": "• Busca mantener alineados mano-codo-hombro durante el recorrido\n• Piensa en alejar tu mano en horizontal respecto a la línea media de tu cuerpo\n• Clava el codo al final del movimiento, pero no es necesario sobrepasar en exceso por detrás la línea de tu torso.\n• Mantén el codo fijo y semiflexionado, evita que se extienda y flexione.\n• Puedes realizarlo de forma horizontal o ligeramente descendente."
  },
  {
    "source_row": 124,
    "source_order": 6,
    "muscle_order": 4,
    "muscle_group": "DELTOIDES POSTERIOR",
    "name": "Contractora invertida",
    "reference_url": "https://www.sergiomcoach.com/topics/6-contractora-invertida-2/",
    "cues": "• Saca las cadera hacia atrás al sentarte y busca clavarte con los pies en el suelo\n• Piensa en separar tus manos y codos “a lo ancho”, no en llevarlos hacia atrás\n• Tus manos deben estar a la misma altura o ligeramente por encima de tu hombro\n• Evita que el codo apunte al suelo. Intenta que apunten hacia afuera."
  },
  {
    "source_row": 125,
    "source_order": 7,
    "muscle_order": 4,
    "muscle_group": "DELTOIDES POSTERIOR",
    "name": "Hang & Swing",
    "reference_url": "https://www.sergiomcoach.com/topics/7-hang-swing-2/",
    "cues": "• Mantén los codos prácticamente estirados o semiflexionados, no los dobles.\n• Evita encoger los trapecios a medida que elevas las mancuernas.\n• No balancees tu cuerpo ni te impulses excesivamente."
  },
  {
    "source_row": 126,
    "source_order": 8,
    "muscle_order": 4,
    "muscle_group": "DELTOIDES POSTERIOR",
    "name": "Hang & Swing en polea",
    "reference_url": "https://www.sergiomcoach.com/topics/8-hang-swing-en-polea-2/",
    "cues": "• Mantén los codos prácticamente estirados o semiflexionados, no los dobles.\n• Evita encoger los trapecios o pegar tirones.\n• Piensa en separar lateralmente las manos del centro de tu cuerpo.\n• Busca mantener tensión constante, sin chocar las placas."
  },
  {
    "source_row": 127,
    "source_order": 9,
    "muscle_order": 4,
    "muscle_group": "DELTOIDES POSTERIOR",
    "name": "Reverse Cable Cross",
    "reference_url": "https://www.sergiomcoach.com/topics/9-reverse-cable-cross-en-banco-inclinado-2/",
    "cues": "• Busca mantener alineados mano-codo-hombro durante el recorrido.\n• Piensa en alejar tus manos en horizontal respecto a la línea media de tu cuerpo.\n• Clavaelcodoalfinaldel movimiento, pero no es necesario sobrepasar en exceso por detrás la línea de tu torso, evita perder tensión en cualquier parte del ROM.\n• Manténelcodofijoysemiflexionado, evita que se extienda y flexione."
  },
  {
    "source_row": 128,
    "source_order": 10,
    "muscle_order": 4,
    "muscle_group": "DELTOIDES POSTERIOR",
    "name": "Pájaros unilaterales en polea baja",
    "reference_url": "https://www.sergiomcoach.com/topics/10-pajaros-unilaterales-en-polea-baja-2/",
    "cues": "• Piensa en separar el codo y la mano de la línea media de tu cuerpo a lo ancho, no en tirar hacia atrás.\n• Puedes añadir una trayectoria ligeramente descendente.\n• Evita balanceos y ayudas con tu cuerpo y cadera. Busca tensión constante."
  },
  {
    "source_row": 129,
    "source_order": 11,
    "muscle_order": 4,
    "muscle_group": "DELTOIDES POSTERIOR",
    "name": "Extensiones de hombro para deltoides posterior",
    "reference_url": "https://www.sergiomcoach.com/topics/11-extensiones-de-hombro-para-deltoides-posterior-2/",
    "cues": "• Manténloscodosextendidos, evita que se muevan debe ser un movimiento puramente de extensión de hombro.\n• Evita “hacer círculos” con los hombros, lleva las mancuernas en diagonal.\n• Saca pecho y lleva atrás los brazos rompiendo la paralela de tu cuerpo."
  },
  {
    "source_row": 130,
    "source_order": 12,
    "muscle_order": 4,
    "muscle_group": "DELTOIDES POSTERIOR",
    "name": "Rear Delt Row",
    "reference_url": "https://www.sergiomcoach.com/topics/12-rear-delt-row-2/",
    "cues": "• Busca un apoyo con la mano libre para generar estabilidad.\n• Lleva el codo y húmero más allá de la línea horizontal de tu torso.\n• Céntra el movimiento en el hombro y deja tu codo fijo, NO lo extiendas."
  },
  {
    "source_row": 131,
    "source_order": 13,
    "muscle_order": 4,
    "muscle_group": "DELTOIDES POSTERIOR",
    "name": "FacePull",
    "reference_url": "https://www.sergiomcoach.com/topics/13-facepull-2/",
    "cues": "• Imagina que quieres separar a lo ancho los codos al llevarlos hacia atrás. Busca amplitud máxima y mantén manos y antebrazos descendidos.\n• Sitúa la polea aproximadamente a la altura de tu cara\n• No te impulses con el cuerpo ni pegues un tirón fuerte del cable, realiza un movimiento puramente desde el hombro ejerciendo fuerza desde los codos."
  },
  {
    "source_row": 133,
    "source_order": 1,
    "muscle_order": 5,
    "muscle_group": "DELTOIDES LATERAL",
    "name": "Elevaciones laterales de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/1-elevaciones-laterales-de-pie-2/",
    "cues": "• Mantén los codos prácticamente estirados o semiflexionados, no los dobles.\n• Evita dirigir los codos hacia atrás a medida que subes, en todo caso hacia delante.\n• A medida que elevas las mancuernas, apunta hacia abajo con el pulgar.\n• No balancees tu cuerpo ni te impulses excesivamente.\n• Flexiona ligeramente el torso, cadera ligeramente hacia atrás."
  },
  {
    "source_row": 134,
    "source_order": 2,
    "muscle_order": 5,
    "muscle_group": "DELTOIDES LATERAL",
    "name": "Elevaciones laterales sentado",
    "reference_url": "https://www.sergiomcoach.com/topics/2-elevaciones-laterales-sentado-2/",
    "cues": "• Mantén los codos prácticamente estirados o semiflexionados, no los dobles.\n• Evita dirigir los codos hacia atrás a medida que subes, en todo caso hacia delante.\n• A medida que elevas las mancuernas, apunta hacia abajo con el pulgar.\n• No balancees tu cuerpo ni te impulses excesivamente.\n• Flexiona ligeramente el torso, cadera ligeramente hacia atrás."
  },
  {
    "source_row": 135,
    "source_order": 3,
    "muscle_order": 5,
    "muscle_group": "DELTOIDES LATERAL",
    "name": "Elevaciones laterales tumbado en banco 45º",
    "reference_url": "https://www.sergiomcoach.com/topics/3-elevaciones-laterales-en-banco-inclinado-45o-2/",
    "cues": "• Mantén los codos semiflexionados y realiza el movimiento en el plano escapular.\n• Evita dirigir los codos hacia atrás a medida que subes.\n• A medida que elevas las mancuernas, apunta hacia abajo con el pulgar.\n• No te balancees, ni redondees la espalda, saca pecho."
  },
  {
    "source_row": 136,
    "source_order": 4,
    "muscle_order": 5,
    "muscle_group": "DELTOIDES LATERAL",
    "name": "Elevaciones laterales en polea baja unilateral",
    "reference_url": "https://www.sergiomcoach.com/topics/4-elevaciones-laterales-en-polea-baja-unilateral-2/",
    "cues": "• Mantén los codos prácticamente estirados o semiflexionados, no los dobles.\n• Realiza el movimiento en el plano escapular. No lleves el codo hacia atrás.\n• No tires del cable con la mano en diagonal, el codo debe conducir el movimiento.\n• A medida que elevas el codo, apunta hacia abajo con el pulgar.\n• No balancees tu cuerpo, ni te impulses excesivamente."
  },
  {
    "source_row": 137,
    "source_order": 5,
    "muscle_order": 5,
    "muscle_group": "DELTOIDES LATERAL",
    "name": "Elevaciones laterales en polea baja a 2 manos",
    "reference_url": "https://www.sergiomcoach.com/topics/5-elevaciones-laterales-en-polea-baja-a-2-manos-2/",
    "cues": "• Mantén los codos prácticamente estirados o semiflexionados, no los dobles.\n• A medida que elevas el codo, apunta hacia abajo con el pulgar.\n• No balancees tu cuerpo ni te impulses excesivamente.\n• Flexiona ligeramente el torso, cadera ligeramente hacia atrás."
  },
  {
    "source_row": 138,
    "source_order": 6,
    "muscle_order": 5,
    "muscle_group": "DELTOIDES LATERAL",
    "name": "Elevaciones laterales en máquina sentado",
    "reference_url": "https://www.sergiomcoach.com/topics/6-elevaciones-laterales-en-maquina-sentado-2/",
    "cues": "• La fuerza y dirección del movimiento debe partir desde los codos.\n• Flexiona ligeramente el torso, cadera ligeramente hacia atrás.\n• No balancees tu cuerpo ni te impulses excesivamente.\n• No dobles el codo en exceso. Es mejor si únicamente está semiflexionado."
  },
  {
    "source_row": 139,
    "source_order": 7,
    "muscle_order": 5,
    "muscle_group": "DELTOIDES LATERAL",
    "name": "Elevaciones laterales tumbado en polea",
    "reference_url": "https://www.sergiomcoach.com/topics/7-elevaciones-laterales-tumbado-en-polea-2/",
    "cues": "• Mantén los codos prácticamente estirados o semiflexionados, no los dobles.\n• A medida que elevas el codo, apunta hacia abajo con el pulgar.\n• La fuerza y dirección del movimiento debe partir desde los codos."
  },
  {
    "source_row": 140,
    "source_order": 8,
    "muscle_order": 5,
    "muscle_group": "DELTOIDES LATERAL",
    "name": "Elevaciones laterales Y",
    "reference_url": "https://www.sergiomcoach.com/topics/8-elevaciones-laterales-y-2/",
    "cues": "• Mantén los codos prácticamente semiflexionados, no los dobles.\n• Empuja con los pies contra el suelo y tu espalda contra el respaldo si lo utilizas.\n• Controla el movimiento, no pegues tirones bruscos.\n• Empuja con los codos-hombros hacia atrás, no tires con las manos."
  },
  {
    "source_row": 141,
    "source_order": 9,
    "muscle_order": 5,
    "muscle_group": "DELTOIDES LATERAL",
    "name": "Remo al mentón en multipower",
    "reference_url": "https://www.sergiomcoach.com/topics/9-remo-al-menton-en-multipower-2/",
    "cues": "• No es necesario que subas al máximo la barra, busca una altura cómoda.\n• No “tires” hacia arriba ni con el trapecio, empuja con los codos lateralmente.\n• Separa la barra ligeramente de ti y prueba a no rodearla con el pulgar.\n• Evita impulsarte con el cuerpo ni aprovechar balanceos, movimiento limpio."
  },
  {
    "source_row": 142,
    "source_order": 10,
    "muscle_order": 5,
    "muscle_group": "DELTOIDES LATERAL",
    "name": "Remo al mentón con barra",
    "reference_url": "https://www.sergiomcoach.com/topics/10-remo-al-menton-con-barra-2/",
    "cues": "• No es necesario que subas al máximo la barra, busca una altura cómoda.\n• No “tires” hacia arriba ni con el trapecio, empuja con los codos lateralmente.\n• Separa la barra ligeramente de ti y prueba a no rodearla con el pulgar.\n• Evita impulsarte con el cuerpo ni aprovechar balanceos, movimiento limpio."
  },
  {
    "source_row": 143,
    "source_order": 11,
    "muscle_order": 5,
    "muscle_group": "DELTOIDES LATERAL",
    "name": "Remo al mentón desde polea baja",
    "reference_url": "https://www.sergiomcoach.com/topics/11-remo-al-menton-desde-polea-baja-2/",
    "cues": "• Dirige el movimiento con los codos, en la polea tenderás más a tirar de ella, sujeta sin rodear con el pulgar el agarre y empuja con los codos.\n• Evita impulsarte, tirar con el cuello y encoger trapecios.\n• Flexiona ligeramente el torso, cadera ligeramente hacia atrás.\n• Controla el movimiento, tanto excéntrica como concéntrica."
  },
  {
    "source_row": 144,
    "source_order": 12,
    "muscle_order": 5,
    "muscle_group": "DELTOIDES LATERAL",
    "name": "Remo al mentón con mancuernas",
    "reference_url": "https://www.sergiomcoach.com/topics/12-remo-al-menton-con-mancuernas-2/",
    "cues": "• No es necesario que subas al máximo las mancuernas, busca una altura cómoda.\n• No “tires” hacia arriba ni con el trapecio, empuja con los codos lateralmente.\n• Evita que el movimiento vaya hacia atrás, mancuernas por delante de ti.\n• Lleva los codos ligermante por delante del cuerpo."
  },
  {
    "source_row": 145,
    "source_order": 13,
    "muscle_order": 5,
    "muscle_group": "DELTOIDES LATERAL",
    "name": "Elevaciones laterales estilo egipcio",
    "reference_url": "https://www.sergiomcoach.com/topics/13-elevaciones-laterales-estilo-egipcio-2/",
    "cues": "• Mantén los codos prácticamente estirados o semiflexionados, no los dobles.\n• No lleves el codo hacia atrás. Busca mantenerte en el plano escapular.\n• Ni tires del cable con la mano en diagonal. Piensa en hacer una trayectoria “circular” con tu codo, imagina que es un limpiaparabrisas.\n• A medida que elevas el codo, apunta hacia abajo con el pulgar.\n• No balancees tu cuerpo, ni te impulses excesivamente."
  },
  {
    "source_row": 146,
    "source_order": 14,
    "muscle_order": 5,
    "muscle_group": "DELTOIDES LATERAL",
    "name": "Butterfly lateral Raises",
    "reference_url": "https://www.sergiomcoach.com/topics/14-butterfly-lateral-raises-2/",
    "cues": "• Comienza con las manos en posición neutra o rotación interna, pero acaba con ellas en posición neutra o rotación externa.\n• Evita dirigir los codos atrás a medida que subes y mantenlos semiflexionados.\n• Controla y aguanta la bajada ejerciendo resistencia a la fase excéntrica.\n• Realiza un ligero impulso con la cadera al inicio del movimiento."
  },
  {
    "source_row": 147,
    "source_order": 15,
    "muscle_order": 5,
    "muscle_group": "DELTOIDES LATERAL",
    "name": "Elevaciones laterales con rotacón interna",
    "reference_url": "https://www.sergiomcoach.com/topics/15-elevaciones-laterales-con-inclinacion-rot-interna-charles-glass-2/",
    "cues": "• Evita dirigir los codos hacia atrás a medida que subes, en todo caso hacia delante.\n• Evita balancear la mancuerna como un columpio o usar impulsos.\n• Céntrate en lanzar y conducir el movimiento con el codo, la mano solo sostiene la mancuerna.\n• Flexiona ligeramente el torso, cadera ligeramente hacia atrás."
  },
  {
    "source_row": 148,
    "source_order": 16,
    "muscle_order": 5,
    "muscle_group": "DELTOIDES LATERAL",
    "name": "Elevaciones laterales con mancuerna apoyado lateralmente en banco inclinado",
    "reference_url": "https://www.sergiomcoach.com/topics/16-elevaciones-laterales-con-mancuerna-apoyado-lateralmente-en-banco-inclinado-2/",
    "cues": "• Evita rebotar la mancuerna con tu muslo para impulsarte.\n• Resiste la fase excéntrica, hazla lenta y controlada.\n• Forma un ángulo obtuso con tu brazo antes de bajar, pero sin llegar a poner el brazo perpendicular al suelo."
  },
  {
    "source_row": 149,
    "source_order": 17,
    "muscle_order": 5,
    "muscle_group": "DELTOIDES LATERAL",
    "name": "Elevaciones laterales cable altura cadera",
    "reference_url": "https://www.sergiomcoach.com/topics/17-elevaciones-laterales-en-polea-cable-altura-cadera-2/",
    "cues": "• Sujeta con la mano libre un apoyo o la propia polea para mayor estabilidad\n• Realiza el movimiento en un plano escapular o frontal. Saca el húmero lateralmente o unos 10-30º adelantado según comodidad.\n• Evita que la fase excéntrica se descontrole, resístela y baja lento.\n• Utiliza preferentemente una muñequera y realiza una ligera rotación interna a medida que subes."
  },
  {
    "source_row": 150,
    "source_order": 18,
    "muscle_order": 5,
    "muscle_group": "DELTOIDES LATERAL",
    "name": "Elevaciones laterales en polea pecho apoyado en banco",
    "reference_url": "https://www.sergiomcoach.com/?post_type=sfwd-topic&p=2482",
    "cues": "• Centra el movimiento en tus codos, no en las manos imagina que son unos limpiaparabrisas y apunta ligeramente al suelo con el pulgar al subir.\n• No dobles en exceso los brazos, mantenlos prácticamente estirados\n• Busca mantener la alineación entre los cables y tus brazos\n• Utiliza muñequeras para mejores sensaciones"
  },
  {
    "source_row": 151,
    "source_order": 19,
    "muscle_order": 5,
    "muscle_group": "DELTOIDES LATERAL",
    "name": "Elevaciones laterales apoyado en banco a 80º",
    "reference_url": "https://www.sergiomcoach.com/topics/19-elevaciones-laterales-con-mancuerna-banco-a-80o-2/",
    "cues": "• Mantén los codos ligeramente por delante de los hombros durante el recorrido\n• Céntrate en el codo no en la mano para aplicar fuera. Además, no los dobles en exceso para evitar reducir mucho el trabajo sobre el hombro.\n• Apunta ligeramente hacia el suelo con el pulgar a medida que subes"
  },
  {
    "source_row": 153,
    "source_order": 1,
    "muscle_order": 6,
    "muscle_group": "DELTOIDES ANTERIOR",
    "name": "Press militar sentado en multipower",
    "reference_url": "https://www.sergiomcoach.com/topics/1-press-militar-sentado-en-multipower-2/",
    "cues": "• Busca alineación antebrazo y muñeca, formando un ángulo de 90º con el suelo.\n• Céntrate en aplicar fuerza verticalmente, lleva la barra “al techo”.\n• Piensa en acercar el antebrazo a la línea vertical de tu hombro, verticalmente. También puede ayudarte pensar en acercar tu bíceps al lateral de tu cara.\n• Recuerda sacar pecho, y mueve tu cabeza para facilitar la verticalidad en el ROM."
  },
  {
    "source_row": 154,
    "source_order": 2,
    "muscle_order": 6,
    "muscle_group": "DELTOIDES ANTERIOR",
    "name": "High incline Dumbell shoulder press",
    "reference_url": "https://www.sergiomcoach.com/topics/2-high-incline-dumbell-shoulder-press-2/",
    "cues": "• Piensa en acercar el antebrazo a la línea vertical de tu hombro, verticalmente. También puede ayudarte pensar en acercar tu bíceps al lateral de tu cara.\n• Evita juntar y chocar las mancuernas en la parte superior.\n• Saca pecho durante el movimiento y clávate bien estable contra el banco."
  },
  {
    "source_row": 155,
    "source_order": 3,
    "muscle_order": 6,
    "muscle_group": "DELTOIDES ANTERIOR",
    "name": "High incline multipower shoulder press",
    "reference_url": "https://www.sergiomcoach.com/topics/3-high-incline-multipower-shoulder-press-2/",
    "cues": "• Busca alineación antebrazo y muñeca, formando un ángulo de 90º con el suelo.\n• Céntrate en aplicar fuerza verticalmente, lleva la barra “al techo”.\n• Piensa en acercar el antebrazo a la línea vertical de tu hombro, verticalmente.\n• Saca pecho durante el movimiento y clávate bien estable contra el banco."
  },
  {
    "source_row": 156,
    "source_order": 4,
    "muscle_order": 6,
    "muscle_group": "DELTOIDES ANTERIOR",
    "name": "Press militar en máquina",
    "reference_url": "https://www.sergiomcoach.com/topics/4-press-militar-en-maquina-2/",
    "cues": "• Piensa en acercar el antebrazo a la línea vertical de tu hombro, verticalmente. También puede ayudarte pensar en acercar tu bíceps al lateral de tu cara.\n• Evita encoger las escápulas trapecio o cuello durante el ejercicio\n• Evita movimientos inestables y descontrolados en las muñecas u hombros.\n• Saca pecho durante el movimiento y deja moverse libres tus escápulas."
  },
  {
    "source_row": 157,
    "source_order": 5,
    "muscle_order": 6,
    "muscle_group": "DELTOIDES ANTERIOR",
    "name": "Press militar half kneeling",
    "reference_url": "https://www.sergiomcoach.com/topics/5-press-militar-half-kneeling-2/",
    "cues": "• Eleva la mancuerna teniendo en cuenta la trayectoria del antebrazo.\n• Busca alineación antebrazo y muñeca, formando un ángulo de 90º con el suelo.\n• Escoge entre un agarre neutro o intermedio."
  },
  {
    "source_row": 158,
    "source_order": 6,
    "muscle_order": 6,
    "muscle_group": "DELTOIDES ANTERIOR",
    "name": "Elevaciones frontales con barra de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/6-elevaciones-frontales-de-pie-con-barra-2/",
    "cues": "• No es necesario llevar la barra hasta el techo, elévala hasta tus ojos o ligeramente por encima de tu cabeza. La parte inicial del ROM puede elevarse.\n• Evita impulsos con el torso, pies o cadera para elevar la barra, no debes convertirlo en un kettlebell swing.\n• Piensa en empujar hacia arriba tus antebrazos con tus deltoides."
  },
  {
    "source_row": 159,
    "source_order": 7,
    "muscle_order": 6,
    "muscle_group": "DELTOIDES ANTERIOR",
    "name": "Elevaciones frontales en polea baja",
    "reference_url": "https://www.sergiomcoach.com/topics/7-elevaciones-frontales-en-polea-baja-2/",
    "cues": "• No es necesario llevar la barra hasta el techo, elévala hasta tus ojos o ligeramente por encima de tu cabeza.\n• La parte inicial del ROM puede elevarse.\n• Evita impulsos con el torso, pies o cadera para elevar la barra.\n• Piensa en empujar hacia arriba tus antebrazos con tus deltoides."
  },
  {
    "source_row": 160,
    "source_order": 8,
    "muscle_order": 6,
    "muscle_group": "DELTOIDES ANTERIOR",
    "name": "Press militar inverso en máquina",
    "reference_url": "https://www.sergiomcoach.com/topics/8-press-militar-inverso-en-maquina-2/",
    "cues": "• Piensa en acercar el antebrazo a la línea vertical de tu hombro, verticalmente. También puede ayudarte pensar en acercar tu bíceps al lateral de tu cara.\n• Evita encoger las escápulas trapecio o cuello durante el ejercicio\n• Evita movimientos inestables y descontrolados en las muñecas u hombros.\n• Saca pecho durante el movimiento y deja moverse libres tus escápulas."
  },
  {
    "source_row": 161,
    "source_order": 9,
    "muscle_order": 6,
    "muscle_group": "DELTOIDES ANTERIOR",
    "name": "Elevaciones frontales en banco inclinado",
    "reference_url": "https://www.sergiomcoach.com/topics/9-elevaciones-frontales-con-barra-en-banco-inclinado-2/",
    "cues": "• Céntrate en la dirección de tus antebrazos, no en la barra.\n• No es necesario elevar la barra excesivamente con situarla en perpendicular al suelo es suficiente.\n• Ejerce fuerza en la subida sin aprovechar impulsos con la barra como un columpio y resiste la fase excéntrica ejerciendo fuerza para bajar lento."
  },
  {
    "source_row": 162,
    "source_order": 10,
    "muscle_order": 6,
    "muscle_group": "DELTOIDES ANTERIOR",
    "name": "Elevaciones frontales desde polea baja en banco inclinado",
    "reference_url": "https://www.sergiomcoach.com/topics/10-elevaciones-frontales-desde-polea-baja-en-banco-inclinado-2/",
    "cues": "• Céntrate en la dirección de tus antebrazos y en empujar con ellos hacia arriba.\n• Evita despegar el culo del asiento o intentar impulsarte con el torso, baja peso y realiza un movimiento lento y controlado.\n• Comienza el movimiento desde la línea de tu pecho hasta alinear los brazos con el banco, no es necesario que las manos vayan a la cadera."
  },
  {
    "source_row": 163,
    "source_order": 11,
    "muscle_order": 6,
    "muscle_group": "DELTOIDES ANTERIOR",
    "name": "Elevaciones frontales con barra tumbado boca arriba en banco inclinado",
    "reference_url": "https://www.sergiomcoach.com/topics/11-elevaciones-frontales-con-barra-tumbado-en-banco-inclinado-boca-arriba-2/",
    "cues": "• No es necesario subir los brazos hasta convertirlo en un Pull Over, busca los 100-110º de flexión de hombro o aproximadamente la altura de tu mirada.\n• Aguanta la fase excéntrica y no rebotes con la barra en los muslos, mantén tensión constante.\n• Fija bien tu espalda contra el banco y pies contra el suelo."
  },
  {
    "source_row": 164,
    "source_order": 12,
    "muscle_order": 6,
    "muscle_group": "DELTOIDES ANTERIOR",
    "name": "Press militar con barra",
    "reference_url": "https://www.sergiomcoach.com/topics/12-press-militar-con-barra-2/",
    "cues": "• Piensa en acercar tus bíceps hacia tu cara a medida que subes\n• No te impulses con el cuerpo o piernas, no saltes. Movimiento estricto de hombros.\n• Escoge una anchura que te permita alinear mano-antebrazo y codo.\n• Recuerda “sacar pecho” durante el movimiento y mover la cabeza ligeramente hacia delante al final del ROM, para favorecer la verticalidad del movimiento."
  },
  {
    "source_row": 165,
    "source_order": 13,
    "muscle_order": 6,
    "muscle_group": "DELTOIDES ANTERIOR",
    "name": "Shoulder Landmine Press",
    "reference_url": "https://www.sergiomcoach.com/topics/13-shoulder-landmine-press-2/",
    "cues": "• Piensa en alejar el disco al máximo de tu cabeza\n• No es necesario bajar el codo lo máximo posible, busca el punto que mejores sensaciones te aporte al deltoides.\n• Evita realizar un impulso inicial demasiado fuerte que facilite el resto del recorrido"
  },
  {
    "source_row": 167,
    "source_order": 1,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Extensiones de codo con mancuerna trasnuca",
    "reference_url": "https://www.sergiomcoach.com/topics/1-extensiones-de-codo-con-mancuerna-trasnuca-2/",
    "cues": "• Céntrate en flexionar y extender los codos por completo,antebrazo toca bíceps.\n• Prueba ambos agarres, copa y neutro y escoge el que mejor sensaciones te de.\n• Mantén estables y fijos los hombros, evitando realizar impulsos con ellos para ayudarte en la extensión de codo durante el movimiento."
  },
  {
    "source_row": 168,
    "source_order": 2,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Extensiones de codo en polea trasnuca con cuerda",
    "reference_url": "https://www.sergiomcoach.com/topics/2-extensiones-de-codo-en-polea-trasnuca-con-cuerda-en-2/",
    "cues": "• Intenta tocar antebrazo y bíceps en cada repetición. El ROM debe ser completo.\n• Evita ayudarte con impulsos y/o con los hombros para realizar la fase concéntrica, piensa únicamente en extender tus codos.\n• Evita centrarte en separar las cuerdas, ya que será un movimiento ineficiente que parte de la muñeca. Céntrate en extender el codo subiéndolas verticalmente."
  },
  {
    "source_row": 169,
    "source_order": 3,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Press francés con mancuernas tumbado",
    "reference_url": "https://www.sergiomcoach.com/topics/3-press-frances-con-mancuernas-tumbado-2/",
    "cues": "• Busca aplastar tu bíceps contra tu antebrazo en cada repetición.\n• No es necesario bloquear del todo los codos, puedes mantener la tensión.\n• Controla la alineación de tus codos, que no se abran en exceso."
  },
  {
    "source_row": 170,
    "source_order": 4,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Press francés con barra tumbado",
    "reference_url": "https://www.sergiomcoach.com/topics/4-press-frances-con-barra-tumbado-2/",
    "cues": "• Busca aplastar tu bíceps contra tu antebrazo en cada repetición.\n• Busca un agarre adecuado ni excesivamente ancho ni estrecho\n• No es necesario bloquear del todo los codos, puedes mantener la tensión.\n• Controla la alineación de tus codos, que no se abran en exceso."
  },
  {
    "source_row": 171,
    "source_order": 5,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Press francés con barra de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/5-press-frances-con-barra-de-pie-2/",
    "cues": "• Busca aplastar tu bíceps contra tu antebrazo en cada repetición.\n• No es necesario bloquear por completo los codos en cada repetición.\n• Controla la alineación de tus codos, que no se abran en exceso. Puedes abrirlos siempre que no te impulses con el hombro/ pectoral para elevar la carga."
  },
  {
    "source_row": 172,
    "source_order": 6,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Rompecráneos con barra EZ",
    "reference_url": "https://www.sergiomcoach.com/topics/6-rompecraneos-con-barra-ez-2/",
    "cues": "• Lleva la barra a la nariz o frente con cuidado, controla la fase excéntrica.\n• Busca aplastar tu bíceps contra tu antebrazo en cada repetición.\n• No es necesario bloquear del todo los codos, puedes mantener la tensión.\n• Controla la alineación de tus codos, que no se abran en exceso."
  },
  {
    "source_row": 173,
    "source_order": 7,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Fondos para tríceps",
    "reference_url": "https://www.sergiomcoach.com/topics/7-fondos-para-triceps-2/",
    "cues": "• No te impulses con las piernas ni te balancees.\n• Mantén la retracción escapular, y no saques “chepa” durante el ejercicio.\n• Inclínate ligeramente hacia delante.\n•Aplicafuerzahaciaabajoy atrás, colocando las manos por debajo de la línea del hombro."
  },
  {
    "source_row": 174,
    "source_order": 8,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Extensiones de codo cruzadas o en X",
    "reference_url": "https://www.sergiomcoach.com/topics/8-extensiones-de-codo-cruzadas-o-en-x-2/",
    "cues": "• Intenta tocar antebrazo y bíceps en cada repetición. El ROM debe ser completo.\n• Evita ayudarte con impulsos, inercias o movimientos de muñeca para realizar más recorrido. Céntrate en la extensión del codo, si quieres puedes bloquear.\n• Busca alinear lo mejor posible la dirección de la fuerza con tu tríceps."
  },
  {
    "source_row": 175,
    "source_order": 9,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Extensión lateral de codo",
    "reference_url": "https://www.sergiomcoach.com/topics/9-extension-lateral-de-codo-2/",
    "cues": "• Intenta tocar antebrazo y bíceps en cada repetición. El ROM debe ser completo.\n• Evita ayudarte con impulsos, inercias o movimientos de muñeca para realizar más recorrido. Céntrate en la extensión del codo, si quieres puedes bloquear.\n• Busca alinear lo mejor posible la dirección de la fuerza con tu tríceps.\n• Tratadefijarelhombro,debe trabajar únicamente el codo."
  },
  {
    "source_row": 176,
    "source_order": 10,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Extensiones de codo en polea con hombro a 90º de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/10-extensiones-de-codo-sentado-en-polea-hombro-a-90o-2/",
    "cues": "• Intenta tocar antebrazo y bíceps en cada repetición. El ROM debe ser completo.\n• Céntrate en la extensión del codo, si quieres puedes bloquearlos.\n• Busca alinear lo mejor posible la dirección de la fuerza con tu tríceps.\n• Empuja con tu cuerpo y pies contra el respaldo, buscando generar estabilidad."
  },
  {
    "source_row": 177,
    "source_order": 11,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Extensiones de codo en polea con hombro a 90º sentado",
    "reference_url": "https://www.sergiomcoach.com/topics/11-extensiones-de-codo-en-polea-con-hombro-a-90o-2/",
    "cues": "• Intenta comprimir antebrazo y bíceps en cada repetición.\n• Céntrate en la extensión del codo, si quieres puedes bloquearlos.\n• Busca alinear lo mejor posible la dirección de la fuerza con tu tríceps.\n• Tratadefijarelhombro,debe trabajar únicamente el codo."
  },
  {
    "source_row": 178,
    "source_order": 12,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Extensiones Katana",
    "reference_url": "https://www.sergiomcoach.com/topics/12-extensiones-katana-2/",
    "cues": "• Mantén una trayectoria ligeramente diagonal para una correcta alineación del movimiento con el tríceps.\n• Evita movimientos con la muñeca, céntrate en extender el codo.\n• Fija el hombro y no lo muevas, evita impulsos y que contribuya al movimiento.\n• Sitúate lateralmente con respecto a la polea, y busca un apoyo de pies estable."
  },
  {
    "source_row": 179,
    "source_order": 13,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Cable Tate Press",
    "reference_url": "https://www.sergiomcoach.com/topics/13-cable-tate-press-2/",
    "cues": "• Lleva el movimiento a un punto cómodo entre el pecho y la barbilla.\n• Mantén la tensión en el cable durante todo el movimiento, controla ambas fases del movimiento sin gestos bruscos, ni en muñeca ni en hombros.\n• Céntrate en extender el dodo y flexiónalo por completo, bíceps toca antebrazo.\n• Busca alinear lo mejor posible la dirección de la fuerza con tu tríceps/húmero."
  },
  {
    "source_row": 180,
    "source_order": 14,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Kaz Press",
    "reference_url": "https://www.sergiomcoach.com/topics/14-kaz-press-2/",
    "cues": "• Céntrate en adelantar los codos lo máximo posible con respecto a la barra\n• Lleva entre tu barbilla y clavículas según comodidad, controlando la excéntrica.\n• Busca aplastar tu bíceps contra tu antebrazo en cada repetición.\n• Evita convertirlo en un press cerrado, no lleves la barra al pecho ni abras codos.\n• Evita que tus muñecas se extiendan para dar más ROM. Flexiónalas ligeramente."
  },
  {
    "source_row": 181,
    "source_order": 15,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "JM Press",
    "reference_url": "https://www.sergiomcoach.com/topics/15-jm-press-2/",
    "cues": "• Céntrate en adelantar los codos lo máximo posible con respecto a la barra\n• Lleva entre tu barbilla y clavículas según comodidad, controlando la excéntrica.\n• Busca aplastar tu bíceps contra tu antebrazo en cada repetición.\n• Evita convertirlo en un press cerrado, no lleves la barra al pecho ni abras codos.\n• Evita que tus muñecas se extiendan para dar más ROM. Flexiónalas ligeramente."
  },
  {
    "source_row": 182,
    "source_order": 16,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Extensiones de codo en polea alta trasnuca",
    "reference_url": "https://www.sergiomcoach.com/topics/17-extensiones-de-codo-en-polea-alta-trasnuca-2/",
    "cues": "• Lleva los codos los más hacia delante posible, evita que se abran en exceso.\n• Trata de doblar y extender el codo por completo, puedes opcionalmente añadir una ligerísima flexión de hombro, pero busca comprimir tu bíceps y antebrazo.\n• Alinea la dirección de movimiento con tu húmero lo máximo posible.\n• Evita impulsarte o ayudarte con el cuerpo y hombros.\n• Si usas una cuerda no te centres en “separarla” si no en llevarla hacia delante."
  },
  {
    "source_row": 183,
    "source_order": 17,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Extensiones de codo en polea V1",
    "reference_url": "https://www.sergiomcoach.com/topics/16-extensiones-de-codo-en-polea-v1-2/",
    "cues": "• Busca aplastar tu antebrazo y tu bíceps, para después extenderlo.\n• El codo (tríceps) es únicamente quien debe realizar el movimiento, céntrate en doblarlo y extenderlo mientras sujetas la barra, no en alejarla de ti.\n• Evita movimientos bruscos o rápidos, controla las fases concéntrica y excéntrica.\n• Evita impulsos e inercias con el torso y los hombros, busca estabilidad."
  },
  {
    "source_row": 184,
    "source_order": 18,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Extensiones de codo en polea V2",
    "reference_url": "https://www.sergiomcoach.com/topics/18-extensiones-de-codo-en-polea-alta-con-barra-v2-2/",
    "cues": "• Busca aplastar tu antebrazo y tu bíceps, para después extenderlo.\n• El hombro acompaña en la subida, pero sin perder tensión. Y se extiende en la bajada pero la barra debe moverse principalmente por la acción del codo.\n• Evita movimientos bruscos o rápidos, controla las fases concéntrica y excéntrica."
  },
  {
    "source_row": 185,
    "source_order": 19,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Extensiones de codo en polea V3",
    "reference_url": "https://www.sergiomcoach.com/topics/19-extensiones-de-codo-en-polea-alta-con-barra-v3-2/",
    "cues": "• Busca aplastar tu antebrazo y tu bíceps en cada repetición antes de extender el codo\n• Posiciona el torso y hombros “encima” de la barra, mantenlos fijos ahí.\n• Céntrate en llevar los codos hacia atrás, evita que se abran lateralmente.\n• Es un movimiento de extensión del codo con un ligero patrón de empuje.\n• Controla que las fases concéntrica y excéntrica no sean rápidas y bruscas."
  },
  {
    "source_row": 186,
    "source_order": 20,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Press francés en polea baja",
    "reference_url": "https://www.sergiomcoach.com/topics/20-press-frances-en-polea-baja-2/",
    "cues": "• Busca aplastar tu bíceps contra tu antebrazo en cada repetición.\n• Céntrate en extender el codo, pero si controlas perfecto el movimiento puedes añadir flexión y extensión de hombro al gesto.\n• Controla la alineación de tus codos, que no se abran en exceso."
  },
  {
    "source_row": 187,
    "source_order": 21,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Tate Press con mancuernas",
    "reference_url": "https://www.sergiomcoach.com/topics/21-tate-press-con-mancuernas-2/",
    "cues": "• Busca llevar los codos lo más lateralmente o “hacia afuera” que puedas, no los pegues a tu torso, no lo conviertas en un Hex Press.\n• Sujeta las mancuernas cerca del tope superior, de forma que haga contacto con tu mano para mayor estabilidad y seguridad en la muñeca.\n• Al extender los codos aprieta los tríceps, pero evita que haya movimientos con el hombro que desplacen la mancuerna (como en un press o unas aperturas).\n• Dirige las pesas hacia tu pectoral, aplastando tu antebrazo y tu bíceps, puedes apoyarlas, o no, en el pecho según comodidad."
  },
  {
    "source_row": 188,
    "source_order": 22,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Push down torso inclinado unilateral",
    "reference_url": "https://www.sergiomcoach.com/topics/22-push-down-torso-inclinado-unilateral-2/",
    "cues": "• Mantén los hombros en posición fija o realiza una ligera flexión. Pero no te impulses con ellos\n• No acortes el ROM, busca comprimir el bíceps con tu antebrazo\n• No arquees el cuerpo y uses inercial corporal, buca una técnica limpia desde el codo, que añada más estímulo no más fatiga."
  },
  {
    "source_row": 189,
    "source_order": 23,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Patada en polea baja",
    "reference_url": "https://www.sergiomcoach.com/topics/23-patada-en-polea-baja-2/",
    "cues": "• Mantén el torso inmóvil, empuja y sujétate con la mano libre contra el apoyo.\n• No acortes el ROM, piensa en comprimir el bíceps con el antebrazo.\n• No te impulses con el cuerpo ni los hombros, busca un movimiento puro desde el tríceps."
  },
  {
    "source_row": 190,
    "source_order": 24,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Press francés en máquina",
    "reference_url": "https://www.sergiomcoach.com/topics/24-press-frances-en-maquina-2/",
    "cues": "• Mantén los brazos apoyados en el acolchado durante todo el movimiento.\n• Agarre firmemente las empuñaduras, empuja desde ahí.\n• Empuja con ambos brazos por igual.\n• No acortes ROM, busca comprimir en la medida de lo posible bíceps y antebrazo."
  },
  {
    "source_row": 191,
    "source_order": 25,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Extensiones de codo desde pecho en polea",
    "reference_url": "https://www.sergiomcoach.com/topics/25-extensiones-de-todo-desde-pecho-en-polea-2/",
    "cues": "• Busca alinear lo mejor posible la trayectoria, los cables y tus brazos.\n• Céntrate en sólo extender los codos, evita trampear añadiendo impulso con el torso u hombros.\n•No acortes el ROM, piensa en comprimir antebrazo y bíceps en cada repetición."
  },
  {
    "source_row": 192,
    "source_order": 26,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Patada en polea tumbado",
    "reference_url": "https://www.sergiomcoach.com/topics/26-patada-en-polea-tumbado-2/",
    "cues": "• Mantén la alineación en todo el recorrido, puedes usar 1 o 2 cuerdas.\n• Puedes mantener un segundo la extensión final.\n• Asegúrate de llegar a una flexión de codo máxima previa a la extensión."
  },
  {
    "source_row": 193,
    "source_order": 27,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Push down polea a la espalda",
    "reference_url": "https://www.sergiomcoach.com/topics/27-push-down-polea-a-la-espalda-2/",
    "cues": "• Realiza un rango de movimiento completo, comprime con tus antebrazos tus bíceps antes de realizar la fase concéntrica y extiende el codo por completo. *Si estás incómodo o pierdes tensión puedes parar justo antes de bloquear.\n• Aleja todo lo que puedas el codo del cable y acércalo todo lo que puedas al mismo.\n• Evita que la fase excéntrica sea descontrolada, resiste y lúchala.\n• Evita impulsarte con tu cuerpo para tirar más carga de la que debes controlar."
  },
  {
    "source_row": 194,
    "source_order": 28,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Extensiones de codo en máquina",
    "reference_url": "https://www.sergiomcoach.com/topics/28-extensiones-de-codo-en-maquina-2/",
    "cues": "• Mantén tus hombros pegados al respaldo en la medida de lo posible y centra el movimiento en los codos.\n• Busca alinear el eje de la máquina con tus codos.\n• Extiende por completo los codos, aunque no es necesario bloquearlos.\n• Evita realizar movimientos extraños con tu cuello o torso."
  },
  {
    "source_row": 195,
    "source_order": 29,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Push down con single handles",
    "reference_url": "https://www.sergiomcoach.com/topics/29-push-down-con-single-handles-2/",
    "cues": "• Aplasta tu bíceps y tu antebrazo en cada repetición.\n• Mantén los hombros fijos y cerca del cable.\n• No metas los codos en la línea debajo del cable, aléjalos del mismo.\n• No te impulses con el torso ni empujes con los hombros."
  },
  {
    "source_row": 196,
    "source_order": 30,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Press francés con mancuernas sentado",
    "reference_url": "https://www.sergiomcoach.com/topics/30-press-frances-con-mancuernas-sentado-2/",
    "cues": "• Realiza rotación externa, las puntas de tus pies deben apuntar hacia afuera.\n• Controla la alineación de tus codos, puedes abrirlos ligeramente pero evita impulsarte con el hombro para elevar la carga.\n• Busca aplastrar tus bíceps y antebrazo en cada repetición.\n• Extiende los codos por completo pero no es necesario llegar a bloquearlos."
  },
  {
    "source_row": 197,
    "source_order": 31,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Extensiones katana con mancuerna",
    "reference_url": "https://www.sergiomcoach.com/topics/31-extensiones-katana-con-mancuerna/",
    "cues": "• Comprime tu bíceps y antebrazo al final de cada fase excéntrica.\n• Realiza un movimiento controlado, un error común es bajar muy deprisa y subir de un tirón.\n• Puedes asistirte con la mano libre agarrando tu codo o tocando tu tríceps."
  },
  {
    "source_row": 198,
    "source_order": 32,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Extensiones de codo tumbado en banco inclinado",
    "reference_url": "https://www.sergiomcoach.com/topics/31-extensiones-de-codo-tumbado-en-banco-inclinado-2/",
    "cues": "• Realiza el movimiento puramente desde los codos, y dale el máximo movimiento posible aplastando bíceps y antebrazo.\n• Evita meter tus codos justo debajo del cable al final de la fase excéntrica.\n• Piensa en llevar tus manos hacia tus muslos.\n• Evita mover los hombros, déjalos fijos y apoyados en el respaldo."
  },
  {
    "source_row": 199,
    "source_order": 33,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Rapunzel PushDowns",
    "reference_url": "https://www.sergiomcoach.com/?post_type=sfwd-topic&p=2530",
    "cues": "• Comprime tu antebrazo y tu bíceps en cada repetición\n• Realiza un movimiento controlado, evita pegar un tirón fuerte y resiste la fase excéntrica\n• Coloca la polea de forma que el cable pase cerca de tu hombro, incluso rozando pero lejos del codo."
  },
  {
    "source_row": 200,
    "source_order": 34,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "Extensiones en polea alta con cuerda",
    "reference_url": "https://www.sergiomcoach.com/topics/33-extensiones-en-polea-alta-con-cuerda-2/",
    "cues": "• Comprime por completo el bíceps y el antebrazo en cada repetición, dobla bien el codo no recortes movimiento.\n• No separes un lado de la cuerda del otro, extiende los codos manteniendo juntas ambas manos\n• Realiza un movimiento controlado, mantente cerca de la polea, con los hombros por delante de los codos y extiende llevando las manos por delante de tu cadera."
  },
  {
    "source_row": 201,
    "source_order": 35,
    "muscle_order": 7,
    "muscle_group": "TRÍCEPS",
    "name": "PJR Pull Over",
    "reference_url": "https://www.sergiomcoach.com/?post_type=sfwd-topic&p=2532",
    "cues": "• Centra el movimiento en el codo, lo principal debe ser flexionar y extender el codo y el hombro sólo realiza un movimiento secundario.\n• Utiliza una barra EZ preferentemente pero también puedes utilizar una mancuerna.\n• Piensa en llevar la mancuerna o barra hacia atrás y hacia abajo, como si quisieras tocar el suelo de detrás del banco con las manos."
  },
  {
    "source_row": 203,
    "source_order": 1,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl con barra de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/curl/",
    "cues": "• Céntrate en el movimiento de flexión del codo\n• No te impulses con la cadera y espalda, mantén tu cuerpo firme y estable.\n• No te centres en llevar la barra lo más alto posible, podrías flexionar el hombro en exceso, si no en intentar tocar el antebrazo y el bíceps.\n• Controla la fase excéntrica, no dejes caer la barra demasiado rápido."
  },
  {
    "source_row": 204,
    "source_order": 2,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl martillo con mancuernas",
    "reference_url": "https://www.sergiomcoach.com/topics/2-curl-martillo-con-mancuernas-2/",
    "cues": "• Céntrate en el movimiento de flexión del codo, el antebrazo busca el bíceps.\n• No te impulses con la cadera ni espalda, mantén tu cuerpo firme y estable.\n• No rotes las muñecas durante el movimiento, mantenlas neutras.\n• No cruces lleves las mancuernas al pecho."
  },
  {
    "source_row": 205,
    "source_order": 3,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl con barra romana",
    "reference_url": "https://www.sergiomcoach.com/topics/3-curl-con-barra-romana-2/",
    "cues": "• Céntrate en el movimiento de flexión del codo, el antebrazo busca el bíceps.\n• No te impulses con la cadera ni espalda, mantén tu cuerpo firme y estable.\n• La fuerza debe partir desde el codo, no desde los hombros. No es una elevación frontal.\n• Puedes añadir flexión de hombro, pero si no es muy ligera no la hagas."
  },
  {
    "source_row": 206,
    "source_order": 4,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl con mancuernas sentado",
    "reference_url": "https://www.sergiomcoach.com/topics/4-curl-con-mancuernas-sentado-2/",
    "cues": "• Céntrate en el movimiento de flexión del codo, antebrazo a tocar bíceps.\n• No te impulses con la espalda, mantén tu cuerpo firme y abdomen activado.\n• No balancees los hombros para subir la mancuerna con inercias."
  },
  {
    "source_row": 207,
    "source_order": 5,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Drag Curl",
    "reference_url": "https://www.sergiomcoach.com/topics/5-drag-curl-con-barra-2/",
    "cues": "• Realiza ambos movimientos a la vez, flexiona el codo mientras lo llevas atrás.\n• La trayectoria de la barra es prácticamente perpendicular al suelo.\n• El gesto principal debe ser el de flexión de codo.\n• No es necesario realizar un agarre activo rodeando con el pulgar."
  },
  {
    "source_row": 208,
    "source_order": 6,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl tumbado en banco inclinado",
    "reference_url": "https://www.sergiomcoach.com/topics/6-curl-tumbado-en-banco-inclinado-2/",
    "cues": "• Céntrate en el movimiento de flexión del codo, no muevas el hombro.\n• Evita balancear los brazos para aprovechar el impulso, no debe ser un péndulo.\n• El bíceps debe quedar prácticamente vertical una vez te sientes.\n• Utiliza preferentemente un agarre supino, aunque puedes partir desde neutro."
  },
  {
    "source_row": 209,
    "source_order": 7,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl bayesian sentado",
    "reference_url": "https://www.sergiomcoach.com/topics/7-curl-bayesian-sentado-2/",
    "cues": "• Tus hombros deben estar fijos. Dobla únicamente el codo.\n• Empújate contra el banco y ancla los pies para generar mayor estabilidad y poder aplicar mejor fuerza con los codos.\n• El movimiento debe ser lento y controlado, evita movimientos bruscos.\n• Prueba a añadir una ligera contracción isométrica en lo más alto, arderá tu bíceps."
  },
  {
    "source_row": 210,
    "source_order": 8,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl predicador con mancuerna a 1 mano",
    "reference_url": "https://www.sergiomcoach.com/topics/8-curl-predicador-con-mancuerna-a-1-mano-2/",
    "cues": "• Evita impulsarte con el torso o cadera echándote hacia atrás para subir la mancuerna, el movimiento lo debe realizar puramente el codo.\n• Intenta no despegar el codo del banco durante el movimiento\n• Evita que en la fase excéntrica el codo se estire por completo, no es necesario.\n• Evita en la fase concéntrica que la mancuerna pase la línea vertical de la gravedad respecto a tu codo, ya que el bíceps no estaría trabajando."
  },
  {
    "source_row": 211,
    "source_order": 9,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl predicador en máquina",
    "reference_url": "https://www.sergiomcoach.com/topics/9-curl-predicador-en-maquina-2/",
    "cues": "• Evita impulsarte con el torso o levantar el culo del asiento para subir la carga\n• Intenta no despegar el codo del banco durante el movimiento.\n• Céntrate en flexionar el codo, controla las fases concéntrica y excéntrica y prueba a añadir una ligera contracción isométrica al final del movimiento.\n• Evita que en la fase excéntrica el codo se estire por completo, no es necesario."
  },
  {
    "source_row": 212,
    "source_order": 10,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl predicador en polea baja unilateral con banco",
    "reference_url": "https://www.sergiomcoach.com/topics/10-curl-predicador-en-polea-baja-unilateral-con-banco-2/",
    "cues": "• Evita impulsarte con el torso o cadera echándote hacia atrás para subir el agarre, el movimiento lo debe realizar puramente el codo\n• Intenta no despegar el codo del banco durante el movimiento.\n• Evita que en la fase excéntrica el codo se estire por completo, no es necesario."
  },
  {
    "source_row": 213,
    "source_order": 11,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl con barra en polea de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/11-curl-con-barra-en-polea-baja-de-pie-2/",
    "cues": "• Céntrate en el movimiento de flexión del codo, aunque puedes añadir una ligera flexión de hombro al final del recorrido.\n• No te impulses con la cadera y espalda, mantén tu cuerpo firme y estable. Trata de mantener glúteo y abdomen activados en todas las fases.\n• Evita que tus codos se abran hacia afuera, deben moverse solo en el plano sagital."
  },
  {
    "source_row": 214,
    "source_order": 12,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl araña con mancuernas",
    "reference_url": "https://www.sergiomcoach.com/topics/12-curl-arana-con-mancuernas-2/",
    "cues": "• Sitúate estable sobre el banco, a ser posible apoya los pies en el suelo ejerciendo presión. Apoya todo tu peso en el banco y evita moverte.\n• Céntrate en la flexión del codo (aplasta arriba antebrazo y bíceps).\n• Evita balancear las mancuernas, brazos u hombros. Nunca deberían pasar la línea perpendicular de la gravedad con el suelo (movimiento excesivo de hombros).\n• Evita movimientos rápidos o bruscos, controla la fase excéntrica."
  },
  {
    "source_row": 215,
    "source_order": 13,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl araña con barra",
    "reference_url": "https://www.sergiomcoach.com/topics/13-curl-arana-con-barra-2/",
    "cues": "• Sitúate estable sobre el banco, a ser posible apoya los pies en el suelo ejerciendo presión. Apoya todo tu peso en el banco y evita moverte.\n• Céntrate en la flexión del codo (aplasta arriba antebrazo y bíceps).\n• Evita balancear la barra, brazos u hombros. Nunca deberían pasar la línea perpendicular de la gravedad con el suelo (movimiento excesivo de hombros).\n• Evita movimientos rápidos o bruscos, controla la fase excéntrica."
  },
  {
    "source_row": 216,
    "source_order": 14,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl araña en polea",
    "reference_url": "https://www.sergiomcoach.com/topics/14-curl-arana-en-polea-2/",
    "cues": "• Sitúate estable sobre el banco, a ser posible apoya los pies en el suelo ejerciendo presión. Apoya todo tu peso en el banco y evita moverte.\n• Céntrate en la flexión del codo (aplasta arriba antebrazo y bíceps).\n• No pegues un tirón del cable, ni bajes rápido. Controla el movimiento."
  },
  {
    "source_row": 217,
    "source_order": 15,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl sentado en máquina",
    "reference_url": "https://www.sergiomcoach.com/topics/15-curl-sentado-en-maquina-2/",
    "cues": "• Empújate contra la máquina y con los pies contra el suelo para estar estable.\n• Evita despegar los codos de la máquina, mantenlos pegados.\n• Céntrate en flexionar los codos, evita mover el hombro en la medida de lo posible.\n• Evita extender por completo los codos mantén siempre tensión."
  },
  {
    "source_row": 218,
    "source_order": 16,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl predicador en polea baja de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/16-curl-predicador-de-pie-en-polea-baja-2/",
    "cues": "• Céntrate en el movimiento de flexión del codo, aunque puedes añadir una ligera flexión de hombro al final del recorrido.\n• No te impulses con la cadera y espalda, mantén tu cuerpo firme y estable.\n• Evita que tus codos se abran hacia afuera, deben moverse solo en el plano sagital.\n• No es necesario estirar “por completo” el codo si no estás cómodo o pierdes tensión."
  },
  {
    "source_row": 219,
    "source_order": 17,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Doble bíceps en polea",
    "reference_url": "https://www.sergiomcoach.com/topics/18-doble-biceps-en-polea-2/",
    "cues": "• Piensa en llevar tu mano al lateral de tu cabeza (sien o mejillas).\n• Busca que al estirar el codo las placas nunca choquen perdiendo tensión.\n• Aguanta la contracción de forma isométrica al final del ROM y realiza una fase excéntrica controlada, resiste al estiramiento.\n• Deja el hombro y tu cuerpo fijos. Recuerda que sólo debe flexionarse el codo."
  },
  {
    "source_row": 220,
    "source_order": 18,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl concentrado con mancuerna",
    "reference_url": "https://www.sergiomcoach.com/topics/19-curl-concentrado-con-mancuerna-2/",
    "cues": "• Evita tirar con el hombro o torso hacia atrás, debe ser un movimiento que venga de flexionar únicamente el codo.\n• No despegues el codo de tu rodilla en ningún momento.\n• Evita “dejar caer” la mancuerna, controla el movimiento en todo momento."
  },
  {
    "source_row": 221,
    "source_order": 19,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl martillo en polea baja",
    "reference_url": "https://www.sergiomcoach.com/topics/17-curl-martillo-en-polea-baja-2/",
    "cues": "• Céntrate en el movimiento de flexión del codo, busca chocar antebrazo y bíceps.\n• No te impulses con la cadera ni espalda, mantén tu cuerpo firme y estable.\n• No rotes las muñecas durante el movimiento, mantenlas neutras."
  },
  {
    "source_row": 222,
    "source_order": 20,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Guillotine Curl",
    "reference_url": "https://www.sergiomcoach.com/topics/20-guillotine-curl-2/",
    "cues": "• Centra el movimiento en los codos, no modifiques la posición del hombro.\n• Evita extender por completo los codos, situar brazos en paralelo al cable quitaría por completo la tensión al bíceps durante el movimiento.\n• Piensa en llevar tus manos a tu cara."
  },
  {
    "source_row": 223,
    "source_order": 21,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Predicador en polea alta",
    "reference_url": "https://www.sergiomcoach.com/topics/21-curl-predicador-en-polea-alta-2/",
    "cues": "• Sitúate de frente a la polea, no lateralmente. El cable debe partir aproximadamente desde la altura de tu cara hacia arriba.\n• No muevas el hombro, deja que el movimiento venga únicamente desde el codo.\n• Piensa en acercar tu mano al lateral de tu cara.\n• Puedes probarlo half kneeling o buscar mayor estabilidad agarrando algo con la mano libre si optas por la variante a 1 mano."
  },
  {
    "source_row": 224,
    "source_order": 22,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl predicador inverso",
    "reference_url": "https://www.sergiomcoach.com/topics/22-curl-predicador-inverso-2/",
    "cues": "• Intenta no despegar el codo del banco durante el movimiento\n• Durante la fase excéntrica, desciende controlado evita que sea muy rápida.\n• Durante la fase concéntrica no lleves el movimiento más allá de la línea vertical del codo."
  },
  {
    "source_row": 225,
    "source_order": 23,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl predicador con barra",
    "reference_url": "https://www.sergiomcoach.com/topics/23-curl-predicador-con-barra-2/",
    "cues": "• Intenta no despegar el codo del banco durante el movimiento.\n• Durante la fase excéntrica, desciende controlado evita que sea muy rápida.\n• Durante la fase concéntrica no lleves el movimiento más allá de la línea vertical del codo.\n• Evita impulsarte con el torso o cadera hacia atrás para mover más carga de la que puedes controlar."
  },
  {
    "source_row": 226,
    "source_order": 24,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl tumbado en polea crucifix",
    "reference_url": "https://www.sergiomcoach.com/topics/24-curl-tumbado-en-poleas-crucifix-2/",
    "cues": "• Evita una fase excéntrica descontrolada, un error común es extender los codos de golpe, sin resistirla.\n• No muevas los hombros para tirar de los cables, hombros fijos y sólo se mueve el codo.\n• Busca alinear tus bíceps con los cables lo mejor que puedas."
  },
  {
    "source_row": 227,
    "source_order": 25,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl en banco inclinado en polea alta",
    "reference_url": "https://www.sergiomcoach.com/topics/25-curl-en-banco-inclinado-en-polea-alta-2/",
    "cues": "• Mantén el movimiento en los codos evita que tus hombros se muevan, flexionándose para tirar más peso del que puedes manejar correctamente.\n• No extiendas por completo los codos para evitar quitar tensión al bíceps.\n• Durante el movimiento, piensa en llevar tus manos a tus mejillas.\n• No escojas un agarre ni muy amplio ni muy estrecho, similar a la anchura de tus hombros será lo mejor para la mayoría."
  },
  {
    "source_row": 228,
    "source_order": 26,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl en banco inclinado en polea baja",
    "reference_url": "https://www.sergiomcoach.com/topics/26-curl-en-banco-inclinado-en-polea-baja-2/",
    "cues": "• Evita pegar un tirón fuerte durante la fase concéntrica, y deja tus hombros quietos no los flexiones.\n• Resiste la fase excéntrica no dejes que la carga “caiga de golpe”.\n• Mantén tus brazos cerca de tu torso, no los adelantes en exceso."
  },
  {
    "source_row": 229,
    "source_order": 27,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Curl bayesian unilateral de pie",
    "reference_url": "https://www.sergiomcoach.com/?post_type=sfwd-topic&p=2560",
    "cues": "• Mantén el hombro fijo, sólo debe moverse el codo.\n• Busca alinear tu brazo (el bíceps) con el cable, no gires o inclines tu torso en exceso\n• Busca un apoyo sobre el que colocar la mano libre para mayor estabilidad\n• Resiste la fase excéntrica, no tengas prisa por hacer el ejercicio."
  },
  {
    "source_row": 230,
    "source_order": 28,
    "muscle_order": 8,
    "muscle_group": "BÍCEPS",
    "name": "Seated High curl",
    "reference_url": "https://www.sergiomcoach.com/?post_type=sfwd-topic&p=2561",
    "cues": "• Piensa en acercar tus manos hacia tu cara\n• Mantén el tríceps apoyado sobre el acolchado\n• Estira el codo bien, un error muy común es hacer recorridos parciales muy cortos\n• No pegues tirones, realiza un movimiento constante y resiste la fase excéntrica"
  },
  {
    "source_row": 232,
    "source_order": 1,
    "muscle_order": 9,
    "muscle_group": "ANTEBRAZO",
    "name": "Extensión de muñeca con barra",
    "reference_url": "https://www.sergiomcoach.com/topics/1-extension-de-muneca-con-barra-2/",
    "cues": "• Trata de alinear antebrazo y codo para después extender la muñeca.\n• Piensa en extender la mano apuntando lo máximo posible con los nodillos hacia tu cuerpo, para después apuntar con ellos hacia el suelo.\n• Mantén los antebrazos pegados al banco no los levantes."
  },
  {
    "source_row": 233,
    "source_order": 2,
    "muscle_order": 9,
    "muscle_group": "ANTEBRAZO",
    "name": "Extensión de muñeca con mancuerna",
    "reference_url": "https://www.sergiomcoach.com/topics/2-extension-de-muneca-con-mancuerna-2/",
    "cues": "• Trata de alinear antebrazo y codo para después extender la muñeca.\n• Piensa en extender la mano apuntando lo máximo posible con los nodillos hacia tu cuerpo, para después apuntar con ellos hacia el suelo.\n• Mantén el antebrazo pegado al banco no lo levantes."
  },
  {
    "source_row": 234,
    "source_order": 3,
    "muscle_order": 9,
    "muscle_group": "ANTEBRAZO",
    "name": "Curl de muñeca con barra",
    "reference_url": "https://www.sergiomcoach.com/topics/3-curl-de-muneca-con-barra-2/",
    "cues": "• Piensa en tus nudillos, en la concéntrica deben apuntar lo más arriba posible. Y en la excéntrica lo más hacia abajo posible, deja que ruede un poco la barra.\n• Trata de alinear codo y muñeca durante la realización del movimiento.\n• Mantén el antebrazo pegado al banco, evita impulsos o despegarlo."
  },
  {
    "source_row": 235,
    "source_order": 4,
    "muscle_order": 9,
    "muscle_group": "ANTEBRAZO",
    "name": "Curl de muñeca con mancuerna",
    "reference_url": "https://www.sergiomcoach.com/topics/4-curl-de-muneca-con-mancuerna-2/",
    "cues": "• Piensa en tus nudillos, en la concéntrica deben apuntar lo más arriba posible. Y en la excéntrica lo más hacia abajo posible, deja que ruede un poco la mancuerna.\n• Trata de alinear codo y muñeca durante la realización del movimiento.\n• Mantén el antebrazo pegado al banco, evita impulsos o despegarlo."
  },
  {
    "source_row": 236,
    "source_order": 5,
    "muscle_order": 9,
    "muscle_group": "ANTEBRAZO",
    "name": "Curl de muñeca en polea baja",
    "reference_url": "https://www.sergiomcoach.com/topics/5-curl-de-muneca-en-polea-baja-2/",
    "cues": "• Durante la fase concéntrica piensa en apuntar hacia ti con tus nudillos.\n• Durante la fase excéntrica deja rodar la barra extendiendo los dedos.\n• Trata de alinear codo y muñeca durante la realización del movimiento.\n• Aguanta la contracción ligeramente y controla ambas fases del ejercicio.\n• Evita encoger el cuello o mover los hombros para elevar la barra."
  },
  {
    "source_row": 237,
    "source_order": 6,
    "muscle_order": 9,
    "muscle_group": "ANTEBRAZO",
    "name": "Rolling Barbell Twist",
    "reference_url": "https://www.sergiomcoach.com/topics/6-rolling-barbell-twist-2/",
    "cues": "• Mantén la tensión en la barra, no dejes que se pierda al pasar de una mano a otra.\n• Cada extensión cuenta como +1 repetición.\n• En cada repetición agarra la barra lo más abajo posible y extiende todo lo que puedas la muñeca, no hagas un movimiento parcial.\n• No tengas prisa, realiza el gesto controlado buscando sentir el antebrazo."
  },
  {
    "source_row": 238,
    "source_order": 7,
    "muscle_order": 9,
    "muscle_group": "ANTEBRAZO",
    "name": "Curl de muñeca sentado",
    "reference_url": "https://www.sergiomcoach.com/topics/7-curl-de-muneca-sentado-en-polea-2/",
    "cues": "• Mantén los antebrazos pegados a tus rodillas en paralelo al suelo, no los levantes\n• Trata de alinear antebrazo y codo para después flexionar la muñeca\n• En el inicio piensa apuntar lo máximo posible con los nodillos hacia el suelo, para después flexionar la muñeca buscando apuntar con ellos hacia el techo."
  },
  {
    "source_row": 239,
    "source_order": 8,
    "muscle_order": 9,
    "muscle_group": "ANTEBRAZO",
    "name": "Kettlebell Wrist Turns",
    "reference_url": "https://www.sergiomcoach.com/topics/8-kettlebell-wrist-turns-2/",
    "cues": "• No dejes caer la kettlebell de golpe, resiste las fases excéntricas.\n• Piensa en volcar tu mano y que acabe apuntando hacia el suelo.\n• Mantén el codo flexionado y pegado al suelo, no lo levantes para hacer fuerza."
  },
  {
    "source_row": 240,
    "source_order": 9,
    "muscle_order": 9,
    "muscle_group": "ANTEBRAZO",
    "name": "Agarre en máquina para antebrazo",
    "reference_url": "https://www.sergiomcoach.com/topics/9-agarre-prension-en-maquina-para-antebrazo-2/",
    "cues": "• Aguanta uno o varios segundos en contracción isométrica una vez cierres el agarre.\n• Vuelve a la posición inicial de forma controlada, evita hacer el ejercicio con prisa.\n• Busca extender al máximo tus dedos, estira todo lo que puedas y piensa en cerrar fuerte la mano."
  },
  {
    "source_row": 241,
    "source_order": 10,
    "muscle_order": 9,
    "muscle_group": "ANTEBRAZO",
    "name": "Extensión de muñeca en polea baja",
    "reference_url": "https://www.sergiomcoach.com/topics/10-extension-de-muneca-en-polea-baja/",
    "cues": "• Busca pasar tus nudillos de mirar hacia el suelo a apuntar hacia el techo\n• Un error es realizar repeticiones muy rápidas, realiza un movimiento controlado\n• Lleva la muñeca hacia delante para darle el máximo rango de movimiento y posteriormente piensa en llevar los nudillos hacia atrás."
  },
  {
    "source_row": 243,
    "source_order": 1,
    "muscle_order": 10,
    "muscle_group": "ABDOMEN",
    "name": "Ab Wheel Roll Out",
    "reference_url": "https://www.sergiomcoach.com/topics/1-ab-wheel-ab-roll-out-2/",
    "cues": "• Intenta que los codos no se te abran hacia afuera, mantén los brazos rectos y tensión sobre la parte superior de tu escápula para que la rueda no se escape.\n• Evita que se produzca una excesiva hiperlordosis lumbar, activa el glúteo\n• Trata de realizar la fase concéntrica en 1 único movimiento fluido, no en 2.\n• Inspira durante la fase excéntrica y espira apretando el abdomen durante la concéntrica. Realiza el movimiento de forma lenta y controlada."
  },
  {
    "source_row": 244,
    "source_order": 2,
    "muscle_order": 10,
    "muscle_group": "ABDOMEN",
    "name": "Body Saw",
    "reference_url": "https://www.sergiomcoach.com/topics/2-body-saw-2/",
    "cues": "• Si no puedes deslizar los pies, el movimiento cambiará ligeramente hacia el torso.\n• Evita que se produzca una excesiva hiperlordosis lumbar, activa el glúteo.\n• Inspira durante la fase excéntrica y espira apretando el abdomen durante la concéntrica. Realiza el movimiento de forma lenta y controlada."
  },
  {
    "source_row": 245,
    "source_order": 3,
    "muscle_order": 10,
    "muscle_group": "ABDOMEN",
    "name": "V Ups",
    "reference_url": "https://www.sergiomcoach.com/topics/3-v-ups-2/",
    "cues": "• Inspira mientras te estiras durante la fase excéntrica y espira mientras contraes de forma potente el abdomen durante la fase concéntrica.\n• A ser posible evita tocar o rebotar en el suelo con los talones y manos para no perder tensión sobre el abdomen\n• Piensa en apretar el abdomen a la vez que subes torso y piernas, no es necesario que llegues a tocarlo, céntrate en despegar tus escápulas e isquios del suelo."
  },
  {
    "source_row": 246,
    "source_order": 4,
    "muscle_order": 10,
    "muscle_group": "ABDOMEN",
    "name": "Stir the pot",
    "reference_url": "https://www.sergiomcoach.com/topics/4-stir-the-pot-2/",
    "cues": "• Puedes alternar repeticiones hacia un lado y hacia otro o directamente realizar primero hacia un lado y luego hacia el otro según preferencias.\n• Mantén la espalda alta ligeramente redondeada.\n• Intenta que no se forme una excesiva lordosis lumbar, mantén el glúteo activado."
  },
  {
    "source_row": 247,
    "source_order": 5,
    "muscle_order": 10,
    "muscle_group": "ABDOMEN",
    "name": "Crunch en polea alta",
    "reference_url": "https://www.sergiomcoach.com/topics/5-crunch-en-polea-alta-2/",
    "cues": "• Inspira durante la fase excéntrica (subida) y espira mientras contraes fuertemente el abdomen durante la concéntrica (bajada)\n• Piensa en llevar tus codos hacia tus rodillas, no en tirar de la cuerda con la mano\n• Estira por completo el abdomen, y contrae todo lo que puedas realiza un rango de movimiento (ROM) lo más completo posible sin perder tensión\n• No tengas prisa, es preferible un movimiento lento y controlado."
  },
  {
    "source_row": 248,
    "source_order": 6,
    "muscle_order": 10,
    "muscle_group": "ABDOMEN",
    "name": "Crunch en máquina sentado",
    "reference_url": "https://www.sergiomcoach.com/topics/6-crunch-en-maquina-sentado-2/",
    "cues": "• Estira por completo el abdomen, y contrae todo lo que puedas realiza un rango de movimiento (ROM) lo más completo posible sin perder tensión.\n• No tengas prisa, es preferible un movimiento lento y controlado.\n• Céntrate en hacer fuerza con los codos hacia abajo al contraer el abdomen.\n• Expulsa el aire al contraer el abdomen para apretarlo más aún."
  },
  {
    "source_row": 249,
    "source_order": 7,
    "muscle_order": 10,
    "muscle_group": "ABDOMEN",
    "name": "Hanging leg raises",
    "reference_url": "https://www.sergiomcoach.com/topics/7-hanging-leg-raises-2/",
    "cues": "• No dejes caer las piernas de golpe desde el apunto más alto, controla la excéntrica descendiendo lento y controlado.\n• Evita inercias, rebotes y balanceos que te ayuden en la fase la concéntrica.\n• Utiliza straps que hagan que el agarre no sea el limitante.\n• Evita que haya un balanceo generado por tu cuerpo manteniendo abdomen contraído durante el recorrido y controlando el movimiento."
  },
  {
    "source_row": 250,
    "source_order": 8,
    "muscle_order": 10,
    "muscle_group": "ABDOMEN",
    "name": "Encogimientos de piernas al pecho en banco plano",
    "reference_url": "https://www.sergiomcoach.com/topics/8-encogimientos-de-piernas-al-pecho-en-banco-plano-2/",
    "cues": "• Piensa en juntar tus rodillas a tu pecho, acercándolos mutuamente.\n• Busca una posición estable, para ello agárrate fuerte al banco.\n• Realiza una fase excéntrica lenta y controlada, estirando tu cuerpo."
  },
  {
    "source_row": 251,
    "source_order": 9,
    "muscle_order": 10,
    "muscle_group": "ABDOMEN",
    "name": "Crunch abdominal",
    "reference_url": "https://www.sergiomcoach.com/topics/9-crunch-abdominal-2/",
    "cues": "• No tengas prisa, es preferible un movimiento lento y controlado\n• Piensa en despegar tus escápulas por completo del suelo, no es necesario incorporarte o sentarte por completo. Dirige los codos hacia las rodillas.\n• Expulsa el aire al contraer el abdomen para apretarlo más aún."
  },
  {
    "source_row": 252,
    "source_order": 10,
    "muscle_order": 10,
    "muscle_group": "ABDOMEN",
    "name": "Wood Chopper",
    "reference_url": "https://www.sergiomcoach.com/topics/10-wood-chopper-2/",
    "cues": "• Aguanta la fase excéntrica, de forma lenta y controlada.\n• No tengas miedo a ponerle peso, debe ser exigente.\n• Sitúa un stance o apoyo de piernas cómodo, igual o ligeramente mayor que el ancho de tus hombros.\n• Contráe el abdomen y expulsa aire al realizar la fase concéntrica."
  },
  {
    "source_row": 253,
    "source_order": 11,
    "muscle_order": 10,
    "muscle_group": "ABDOMEN",
    "name": "Press Pallof",
    "reference_url": "https://www.sergiomcoach.com/topics/11-press-pallof-2/",
    "cues": "• Aguanta la fase excéntrica, de forma lenta y controlada.\n• No tengas miedo a ponerle peso, debe ser exigente.\n• Sitúa un stance o apoyo de piernas cómodo, igual o ligeramente mayor que el ancho de tus hombros."
  },
  {
    "source_row": 254,
    "source_order": 12,
    "muscle_order": 10,
    "muscle_group": "ABDOMEN",
    "name": "Crunch inverso en banco declinado",
    "reference_url": "https://www.sergiomcoach.com/topics/12-crunch-inverso-en-banco-declinado-2/",
    "cues": "• Piensa en acercar tus costillas a tu cadera, no sólo en subir las piernas.\n• Controla y resiste la fase excéntrica, no dejes caer tus piernas.\n• Expulsa aire a la vez que subes, lo contráes y aprietas conscientemente.\n• Puedes progresar inclinando más el banco, haciendo más repeticiones o añadiendo lastres a tus piernas."
  },
  {
    "source_row": 255,
    "source_order": 13,
    "muscle_order": 10,
    "muscle_group": "ABDOMEN",
    "name": "Suitcase Carry",
    "reference_url": "https://www.sergiomcoach.com/topics/13-suitcase-carry-2/",
    "cues": "• Estabiliza tu cuerpo con la mano contraria, puedes llevarla hacia abajo paralela al cuerpo o en horizontal hacia un lado según comodidad\n• Coloca la mancuerna sólo en 1 lado\n• Mantén abdomen activo y contraído de forma que no inclines hacia un lado la columna, busca mantenerte recto."
  },
  {
    "source_row": 256,
    "source_order": 14,
    "muscle_order": 10,
    "muscle_group": "ABDOMEN",
    "name": "Pike",
    "reference_url": "https://www.sergiomcoach.com/topics/14-pike-2/",
    "cues": "• Expulsa aire y contrae fuerte el abdomen durante la fase concéntrica\n• Regresa de forma lenta y controlada, resistiendo la excéntrica a la posición inicial\n• Puedes encoger las rodillas hacia el pecho únicamente si te cuesta realizar el ejercicio en su nivel avanzado con las rodillas extendidas."
  },
  {
    "source_row": 257,
    "source_order": 15,
    "muscle_order": 10,
    "muscle_group": "ABDOMEN",
    "name": "Crunch en máquina tumbado",
    "reference_url": "https://www.sergiomcoach.com/topics/15-crunch-en-maquina-tumbado-2/",
    "cues": "• Piensa en llevar tus costillas hacia tu cadera, despegando únicamente la parte alta de tu espalda\n• Tracciona ligeramente desde los pies \n• Sopla y expulsa aire a la vez que aprietas fuerte el abdomen\n• Resiste la fase excéntrica, realiza un movimiento controlado y sin rebotes o impulsos entre fases."
  },
  {
    "source_row": 258,
    "source_order": 16,
    "muscle_order": 10,
    "muscle_group": "ABDOMEN",
    "name": "Crunch en polea en banco declinado",
    "reference_url": "https://www.sergiomcoach.com/topics/16-crunch-en-polea-baja-en-banco-declinado-2/",
    "cues": "• Piensa en llevar tus costillas hacia tu pelvis y los codos hacia las rodillas\n• Contrae fuerte el abdomen durante la fase concéntrica a la vez que expulsas aire\n• Evita tirones fuertes al inicio, realiza un movimiento controlado de subida y bajada excéntrica, sin prisa. No quieras correr por meter más kgs.\n• Céntrate en despegar del banco tus escápulas y espalda alta no es necesaria toda la columna."
  },
  {
    "source_row": 260,
    "source_order": 1,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Hipthrust",
    "reference_url": "https://www.sergiomcoach.com/topics/1-hipthrust-2/",
    "cues": "• La mirada preferentemente debe ir al frente, imagina que tienes que sujetar una pelota en el pecho con tu barbilla.\n• Realiza retroversión pélvica y “squeeze” con el glúteo en la parte superior\n• El pie debe quedar debajo de la rodilla y ligeramente rotado hacia el exterior\n• Realiza una extensión completa de cadera, manteniendo la columna neutra\n• Evita rebotar con los discos en el suelo, mantén tensión constante y realiza un movimiento lento y controlado."
  },
  {
    "source_row": 261,
    "source_order": 2,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Skorcher Hiptrhust",
    "reference_url": "https://www.sergiomcoach.com/topics/2-skorcher-hipthrust-2/",
    "cues": "• La mirada preferentemente debe ir al frente, imagina que tienes que sujetar una pelota en el pecho con tu barbilla.\n• Realiza retroversión pélvica y “squeeze” con el glúteo en la parte superior.\n• Realiza una\ncompleta de manteniendo la columna neutra.\n• Mantén tensión constante y realiza un movimiento lento y controlado."
  },
  {
    "source_row": 262,
    "source_order": 3,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "GluteBridge",
    "reference_url": "https://www.sergiomcoach.com/topics/3-glutebridge-2/",
    "cues": "• La mirada preferentemente debe ir al frente, imagina que tienes que sujetar una pelota en el pecho con tu barbilla.\n• Realiza retroversión pélvica y “squeeze” con el glúteo en la parte superior.\n• Pies rotados externamente con una anchura ligeramente superior a tus hombros.\n• Evita rebotar con los discos en el suelo, mantén tensión constante."
  },
  {
    "source_row": 263,
    "source_order": 4,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Hipthrust Unilateral con mancuerna",
    "reference_url": "https://www.sergiomcoach.com/topics/4-hipthrust-unilateral-con-mancuerna-2/",
    "cues": "• La mirada preferentemente debe ir al frente, imagina que tienes que sujetar una pelota en el pecho con tu barbilla.\n• Realiza retroversión pélvica y “squeeze” con el glúteo en la parte superior.\n• Pie rotado externamente y tibia en perpendicular al suelo, rodilla a 90º.\n• Mantén tensión constante y sujeta la mancuerna todo el recorrido."
  },
  {
    "source_row": 264,
    "source_order": 5,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Hipthrust Unilateral con barra",
    "reference_url": "https://www.sergiomcoach.com/topics/5-hiptrhust-unilateral-con-barra-2/",
    "cues": "• La mirada preferentemente debe ir al frente, imagina que tienes que sujetar una pelota en el pecho con tu barbilla.\n• Realiza retroversión pélvica y “squeeze” con el glúteo en la parte superior.\n• Pie rotado externamente y tibia en perpendicular al suelo, rodilla a 90º.\n• Mantén tensión constante y sujeta la mancuerna todo el recorrido."
  },
  {
    "source_row": 265,
    "source_order": 6,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Hiptrhust en máquina",
    "reference_url": "https://www.sergiomcoach.com/topics/6-hipthrust-en-maquina-2/",
    "cues": "• La mirada preferentemente debe ir al frente, imagina que tienes que sujetar una pelota en el pecho con tu barbilla.\n• Realiza retroversión pélvica y “squeeze” con el glúteo en la parte superior\n• Realiza una extensión completa de cadera, manteniendo la columna neutra\n• Realiza el rango de movimiento más completo que te permita la máxima, manteniendo tensión constante y realizando un movimiento controlado."
  },
  {
    "source_row": 266,
    "source_order": 7,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Cable Pull Through",
    "reference_url": "https://www.sergiomcoach.com/topics/7-cable-pull-through-2/",
    "cues": "• Realiza retroversión pélvica y “squeeze” en el punto de máxima contracción.\n• Piensa en llevar la cadera hacia atrás a modo de bisagra, no realices el movimiento con las rodillas “aguachándote” o con la espalda extendiéndose.\n• La columna debe permanecer neutra pero puedes realizar una ligera cifosis al hacer retroversión pélvica mientras miras hacia abajo en la máxima contracción."
  },
  {
    "source_row": 267,
    "source_order": 8,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Cable Kick Back",
    "reference_url": "https://www.sergiomcoach.com/topics/8-cable-kick-back-2/",
    "cues": "• Piensa en hacer una trayectoria “angular hacia arriba y afuera” con tu pie desde tu glúteo. Evita “patear” hacia atrás horizontalmente extendiendo la rodilla.\n• Mantén la pierna con ligera rotación externa\n• Realiza un movimiento controlado y resiste el descenso durante la excéntrica.\n• Agarra un apoyo estable con las manos y no te impulses excesivamente con el torso, aunque puede haber algo de movimiento."
  },
  {
    "source_row": 268,
    "source_order": 9,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Leg Swing",
    "reference_url": "https://www.sergiomcoach.com/topics/9-leg-swing-2/",
    "cues": "• Piensa en separar lo máximo posible tu pie o tu fémur de tu cuerpo lateralmente.\n• Evita inercias e impulsos especialmente en la primera mitad del movimiento.\n• Evita inclinar excesivamente el cuerpo hacia el lado contrario para ayudarte.\n• Busca un apoyo con la mano para generar una posición estable."
  },
  {
    "source_row": 269,
    "source_order": 10,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Abducciones en máquina sentado",
    "reference_url": "https://www.sergiomcoach.com/topics/10-abducciones-en-maquina-sentado-2/",
    "cues": "• Realiza un movimiento controlado, evita repeticiones rápidas o con rebotes.\n• Piensa en separar al máximo una rodilla de la otra horizontalmente.\n• Aguanta la contracción ligeramente antes de la excéntrica."
  },
  {
    "source_row": 270,
    "source_order": 11,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Clam shell 3D",
    "reference_url": "https://www.sergiomcoach.com/topics/11-clam-shell-3d-2/",
    "cues": "• Piensa en empujar con la rodilla apoyada contra el suelo a la vez que sacas la cadera extendiéndola y pudiendo añadir una ligera retroversión.\n•Valora añadir una goma elástica o resistencia en a las rodillas y/o cadera.\n• Realiza primero el movimiento de abducción y posteriormente el de extensión.\n• Sitúa tu cuerpo en una posición estable apoyando el antebrazo por completo.\n• Imagina que quieres “tocar separar las rodillas horizontalmente” y a la vez llevar la cadera a la línea del hombro contrayendo el glúteo."
  },
  {
    "source_row": 271,
    "source_order": 12,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Reverse glute hyperextensions en multipower",
    "reference_url": "https://www.sergiomcoach.com/topics/12-reverse-glute-hyperextensions-en-multipower-2/",
    "cues": "• Céntrate en contraer el glúteo y apretar todo lo que puedas arriba\n• Rota ligeramente hacia afuera los pies, sitúalos a un ancho superior a tus hombros y apoya la barra en el mediopié o en el talón.\n• Evita que el movimiento sea demasiado rápido, sube y baja controlando.\n• No hiperextiendas la zona lumbar para buscar una mayor elevación de la barra."
  },
  {
    "source_row": 272,
    "source_order": 13,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Patada de glúteo en multipower",
    "reference_url": "https://www.sergiomcoach.com/topics/13-patada-de-gluteo-en-cuadrupedia-en-multipower-2/",
    "cues": "• Céntrate en contraer el glúteo y apretar todo lo que puedas hacia arriba.\n• Rota ligeramente el pie hacia afuera y apoya la barra en el mediopié o en el talón.\n• Evita que el movimiento sea demasiado rápido, sube y baja controlando.\n• No hiperextiendas la zona lumbar para buscar una mayor elevación de la barra."
  },
  {
    "source_row": 273,
    "source_order": 14,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Hiperextensiones 45º foco glúteo",
    "reference_url": "https://www.sergiomcoach.com/topics/14-hiperextensiones-45o-foco-gluteo-2/",
    "cues": "• Escoge un apoyo de piernas amplio y con rotación externa (puntas de los pies hacia afuera).\n• Mantén la espalda alta con una ligera cifosis (redondeada) \n• Coloca la parte superior del banco por debajo de tus caderas\n• Realiza retroversión pélvica en la parte más alta del recorrido."
  },
  {
    "source_row": 274,
    "source_order": 15,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Clam Shell",
    "reference_url": "https://www.sergiomcoach.com/topics/15-clam-shell-2/",
    "cues": "• Sitúa tu cuerpo en una posición estable apoyando el antebrazo por completo.\n• Imagina que quieres “tocar separar las rodillas horizontalmente” y a la vez llevar la cadera a la línea del torso.\n• Manténtensiónconstante, movimiento lento y controlado."
  },
  {
    "source_row": 275,
    "source_order": 16,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Abducciones con miniband",
    "reference_url": "https://www.sergiomcoach.com/topics/14-abducciones-con-miniband-2/",
    "cues": "• Realiza un movimiento controlado, evita repeticiones rápidas o con rebotes.\n• Evita perder tensión en la goma al final de la fase excéntrica.\n• Piensa en separar al máximo una rodilla de la otra horizontalmente."
  },
  {
    "source_row": 276,
    "source_order": 17,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Patada de glúteo en cuadrupedia en polea baja",
    "reference_url": "https://www.sergiomcoach.com/topics/16-patada-de-gluteo-en-cuadrupedia-en-polea-2",
    "cues": "• Piensa en una trayectoria “angular hacia arriba y afuera” con tu pie desde tu glúteo. Evita “patear” hacia extendiendo la rodilla.\n• Mantén una ligera rotación externa de cadera.\n• Realiza un movimiento controlado y resiste el descenso durante la excéntrica."
  },
  {
    "source_row": 277,
    "source_order": 18,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "FrogPumps",
    "reference_url": "https://www.sergiomcoach.com/topics/18-frogpumps-2/",
    "cues": "• Sitúa los codos a los lados de tus costillas y clávalos contra el suelo.\n• Busca realizar máxima extensión y retroversión pélvica, añadiendo “squeeze” en la parte más alta y de máxima contracción del movimiento.\n• Mantén los pies enfrentados, apretando un talón contra el otro.\n• Flexiona el cuello, piensa en que tienes que mantener una “pelota” entre barbilla y esternón."
  },
  {
    "source_row": 278,
    "source_order": 19,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Kick Back en máquina",
    "reference_url": "https://www.sergiomcoach.com/topics/19-kick-back-en-maquina-2/",
    "cues": "• Céntrate en contraer y apretar el glúteo. Aguanta brevemente la contracción de forma isométrica al final del ROM.\n• En caso de ser posible busca una ligera rotación externa de cadera\n• No hiperextiendas la zona lumbar para buscar elevar más la plataforma\n• Busca un apoyo estable en caso de ser posible agarrando manetas y apoyando todo el peso de tu torso sobre el soporte, si la máquina cuenta con él."
  },
  {
    "source_row": 279,
    "source_order": 20,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Reverse glute hyperextensions en máquina",
    "reference_url": "https://www.sergiomcoach.com/topics/20-reverse-glutehyperextensions-en-maquina-2/",
    "cues": "• Realiza rotación externa, las puntas de tus pies deben apuntar hacia afuera.\n• Evita una hiperlorsosis lumbar excesiva, no es necesario que lleves los pies lo más alto que puedas simplemente alcanzar o ligeramente traspasar la paralela.\n• Aguanta la contracción y controla la fase excéntrica.\n• Tracciona ligeramente con las manos para estar estable."
  },
  {
    "source_row": 280,
    "source_order": 21,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "MonsterWalks",
    "reference_url": "https://www.sergiomcoach.com/topics/18-monster-walks-2/",
    "cues": "• Mantén tensión constante, evita que la goma se destense.\n• Situa la cadera en una flexión muy ligera con las manos sobre ella.\n• Da pasos suficientemente amplios como para generar tensión.\n• Piensa en alejar tu pie de la línea media de tu cuerpo."
  },
  {
    "source_row": 281,
    "source_order": 22,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Glute Press Down",
    "reference_url": "https://www.sergiomcoach.com/topics/22-glute-press-down-2/",
    "cues": "• Mantén una alineación en el plano sagital de las articulaciones de la cadera, rodilla y tobillo.\n• Procura que no haya demasiada flexión de rodilla.\n• Empuja desde el talón.\n• Control e intención, la primera y la última repetición deben ser iguales, solo se admite pérdida de velocidad.\n• Sujétate bien a la máquina."
  },
  {
    "source_row": 282,
    "source_order": 23,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Leg Swing en máquina",
    "reference_url": "https://www.sergiomcoach.com/topics/23-leg-swing-en-maquina-2/",
    "cues": "• Piensa en alejar tu pie o fémur lo máximo posible respecto a la pierna contraria\n• Evita inclinar excesivamente tu cuerpo hacia el lado contrario para dar falsa sensación de movimiento o impulsarte.\n• Busca crear un apoyo estable, agarrando fuertemente las manetas.\n• Evita impulsos e inercias, realiza un movimiento controlado. Tu pierna no debe ser un columpio."
  },
  {
    "source_row": 283,
    "source_order": 24,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Prensa de piernas énfasis glúteo",
    "reference_url": "https://www.sergiomcoach.com/topics/24-prensa-de-piernas-enfasis-gluteo-2/",
    "cues": "• Sitúa las piernas en la parte más alta de la plataforma, algo más abiertas de lo normal y con los pies ligeramente rotados hacia afuera.\n• Céntrate el movimiento y la flexo-extensión en la cadera, no en la rodilla.\n• Coloca el respaldo algo más inclinado de lo normal."
  },
  {
    "source_row": 284,
    "source_order": 25,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Sentadilla búlgara énfasis glúteo",
    "reference_url": "https://www.sergiomcoach.com/topics/25-sentadilla-bulgara-enfasis-gluteo-2/",
    "cues": "• Busca bajar manteniendo la tibia aproximadamente a 90o con el suelo.\n• Inclina tu torso hacia delante, acercando el abdomen al glúteo.\n• Busca que el movimiento venga principalmente de la cadera y no desde la rodilla.\n• Agarra con la mano libre un apoyo, pero no te impulses con él."
  },
  {
    "source_row": 285,
    "source_order": 26,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Abducciones en máquina de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/26-abducciones-en-maquina-de-pie-sentado-2/",
    "cues": "• Empuja con las rodillas contra las almohadillas, no con los pies.\n• Piensa en separar tus rodillas de tu ombligo hacia los lados.\n• Tracciona con las manos para generar una posición estable.\n• Mantén los codos extendidos para evitar cargar tus bíceps en exceso.\n• Realiza un movimiento lento yu controlado."
  },
  {
    "source_row": 286,
    "source_order": 27,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Glute Ham Raise énfasis Glúteo",
    "reference_url": "https://www.sergiomcoach.com/topics/27-glute-ham-raise-enfasis-gluteo-2/",
    "cues": "• Deja las rodillas fijas, céntrate en extender la cadera.\n• Aprieta los glúteos durante la fase concéntrica y resiste la fase excéntrica.\n• Piensa en formar una “C” con tu cuerpo.\n• Las puntas de tus pies deben apuntar hacia afuera ligeramente."
  },
  {
    "source_row": 287,
    "source_order": 28,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Patada de glúteo en máquina de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/28-patada-de-gluteo-en-maquina-de-placas-de-pie-2/",
    "cues": "• Realiza rotación externa, las puntas de tus pies deben apuntar hacia afuera.\n• Aguanta al final de la fase concéntrica ligeramente apretando el glúteo antes de volver lento a la posición inicial.\n• Extiende la cadera, no pegues “una patada de burro” extendiendo la rodilla.\n• Piensa en llevar el pie hacia atrás y hacia afuera, contrayendo el glúteo."
  },
  {
    "source_row": 288,
    "source_order": 29,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Hiptrhust en multipower",
    "reference_url": "https://www.sergiomcoach.com/?post_type=sfwd-topic&p=2618",
    "cues": "• Mantén la mirada al frente, como si quisieras mantener una pelota entre tu pecho y tu barbilla\n• Realiza retroversión pélvica y estruja el glúteo en la parte superior del movimiento.\n• Evita inercias e impulsos excesivos, sube de forma controlada\n• Realiza una extensión de cadera completa, manteniendo la columna neutra\n• Apunta con los pies hacia afuera, rótalos externamente."
  },
  {
    "source_row": 289,
    "source_order": 30,
    "muscle_order": 11,
    "muscle_group": "GLÚTEO",
    "name": "Cable Kick back en banco inclinado",
    "reference_url": "https://www.sergiomcoach.com/topics/30-cable-kick-back-en-banco-inclinado/",
    "cues": "• Piensa en describir un arco con tu pierna, no en patear hacia atrás\n• Lanza tu pie hacia atrás y hacia afuera mientras va rotado externamente\n• Agárrate al banco con uno de los brazos, puedes sujetarte al brazo de la polea con el otro y sitúa la pierna libre sobre el banco de forma que generes un apoyo totalmente estable."
  },
  {
    "source_row": 291,
    "source_order": 1,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Sentadilla en multipower",
    "reference_url": "https://www.sergiomcoach.com/topics/1-sentadilla-en-multipower-2/",
    "cues": "• Mientras empujas hacia arriba y piensa en empujar hacia delante con tus pies con la intención “tirarte” hacia atrás con la espalda durante la fase concéntrica.\n• Realiza el movimiento lo máximo posible dentro del plano sagital, lleva las rodillas lo más “hacia delante” posible. Evita que se abran o colapsen\n• Piensa en aplastar tus gemelos y tus isquiosurales, si tu movilidad te lo permite, para trabajar con flexión de rodilla completa. Sin que se despeguen los talones.\n• Busca un stance cómodo en cuanto a anchura y distancia de pies respecto a la barra que maximice el rango de movimiento."
  },
  {
    "source_row": 292,
    "source_order": 2,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Sentadilla Hack",
    "reference_url": "https://www.sergiomcoach.com/topics/2-sentadilla-hack-2/",
    "cues": "• Mientras empujas hacia arriba y piensa en empujar hacia delante con tus pies buscando empujarte contra el respaldo.\n• Realiza el movimiento lo máximo posible dentro del plano sagital, lleva las rodillas lo más “hacia delante” posible, evita que se abran o colapsen.\n• Piensa en aplastar tus gemelos con tus isquiosurales, si tu movilidad te lo permite, para trabajar con flexión de rodilla completa.\n• Busca un stance cómodo que maximice el ROM, sin despegar los talones."
  },
  {
    "source_row": 293,
    "source_order": 3,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Split squat en multipower",
    "reference_url": "https://www.sergiomcoach.com/topics/3-split-squat-en-multipower-2/",
    "cues": "• Trata de mantener el torso vertical y perpendicular al suelo.\n• Aplica fuerza hacia delante y hacia abajo con el pie para subir.\n• Busca la máxima flexión de rodilla, adelántala todo lo que puedas respecto a la punta del pie."
  },
  {
    "source_row": 294,
    "source_order": 4,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Split squat libre",
    "reference_url": "https://www.sergiomcoach.com/topics/4-split-squat-libre-2/",
    "cues": "• Trata de mantener el torso vertical y perpendicular al suelo\n• Aplica fuerza hacia delante y hacia abajo con el pie durante la fase concéntrica.\n• Busca la máxima flexión de rodilla posible, adelántala todo lo que puedas respecto a la punta del pie."
  },
  {
    "source_row": 295,
    "source_order": 5,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Prensa 45º",
    "reference_url": "https://www.sergiomcoach.com/topics/5-prensa-45o-2/",
    "cues": "• Coloca los pies abajo y con una anchura cómoda que permita maximizar el ROM (aprox. anchura hombros) y con los pies neutros, sin rotar hacia ningún lado.\n• Realiza el máximo rango de recorrido posible, valorando la flexión de rodilla. Piensa en aplastar tus gemelos con tus isquios. No recortes ROM para subir peso.\n• Evita que se te despeguen los talones de la plataforma y que tus rodillas colapsen hacia adentro.\n• Evita rebotes o inercias que te ayuden en la fase concéntrica."
  },
  {
    "source_row": 296,
    "source_order": 6,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Prensa horizontal",
    "reference_url": "https://www.sergiomcoach.com/topics/6-prensa-horizontal-2/",
    "cues": "• Coloca los pies abajo y neutros, con una anchura que permita maximizar el ROM\n• Realiza el máximo rango de recorrido posible, valorando la flexión de rodilla.\n• Evita que se te despeguen los talones de la plataforma y que tus rodillas colapsen.\n• Piensa en adelantar las puntas de tus pies con las rodillas."
  },
  {
    "source_row": 297,
    "source_order": 7,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Sentadilla búlgara en multipower",
    "reference_url": "https://www.sergiomcoach.com/topics/7-sentadilla-bulgara-en-multipower-2/",
    "cues": "• Trata de mantener el torso vertical y perpendicular al suelo.\n• Aplica fuerza hacia delante y hacia abajo con el pie para subir.\n• Busca la máxima flexión de rodilla, adelanta la rodilla todo lo que puedas respecto a la punta del pie. Puedes utilizar un tacón."
  },
  {
    "source_row": 298,
    "source_order": 8,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Sentadilla búlgara con mancuerna + apoyo de mano",
    "reference_url": "https://www.sergiomcoach.com/topics/8-sentadilla-bulgara-con-mancuerna-apoyo-de-mano-2/",
    "cues": "• Utiliza straps para que el agarre de la mancuerna no te limite y poder cargar más peso. Coloca la mancuerna en el lado, generalmente.\n• Trata de mantener el torso vertical y perpendicular al suelo\n• Aplica fuerza hacia delante y hacia abajo con el pie para subir\n• Busca la máxima flexión de rodilla, adelanta la rodilla todo lo que puedas respecto a la punta del pie. Puedes utilizar un tacón."
  },
  {
    "source_row": 299,
    "source_order": 9,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Leg Extensions",
    "reference_url": "https://www.sergiomcoach.com/topics/9-leg-extensions-2/",
    "cues": "• No tengas prisa, aguanta la fase excéntrica y contrae fuerte en la concéntrica. Prueba a añadir una ligera pausa en la parte de arriba antes de descender.\n• Agárrate fuerte a las manetas para evitar desplazarte y poder aplicar más fuerza.\n• Fija tu cadera al banco, evita levantar el glúteo o despegarla."
  },
  {
    "source_row": 300,
    "source_order": 10,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Zancadas con mancuerna",
    "reference_url": "https://www.sergiomcoach.com/topics/10-zancadas-con-mancuerna-2/",
    "cues": "• Trata de mantener el torso vertical y perpendicular al suelo\n• Aplica fuerza hacia delante y hacia abajo con el pie durante la fase concéntrica.\n• No alejes en exceso el apoyo respecto a tu cuerpo.\n• Busca la máxima flexión de rodilla posible, adelántala todo lo que puedas respecto a la punta del pie. Evita que la rodilla se mueva lateralmente.\n• Valora utilizar straps para poder cargar más peso."
  },
  {
    "source_row": 301,
    "source_order": 11,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Pendulum Squat",
    "reference_url": "https://www.sergiomcoach.com/topics/11-pendulum-squat-2/",
    "cues": "• Busca comprimir tus isquios y tus gemelos para alcanzar la máxima flexión de rodilla posible\n• No coloques los pies excesivamente arriba en la plataforma y utiliza un stance o anchura similar a la de tus hombros\n• Empuja contra la plataforma y hacia adelante con los pies, y contra el respaldo con tu torso\n• Evita rebotar abajo como un muelle, añade una ligera pausa entre concñentrica y excéntrica."
  },
  {
    "source_row": 302,
    "source_order": 12,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Prensa horizontal plate loaded",
    "reference_url": "https://www.sergiomcoach.com/topics/12-prensa-horizontal-pendular-plate-loaded-2/",
    "cues": "• Coloca los pies lo más abajo posible y neutros, con una anchura que permita maximizar el ROM, generalmente la anchura de tus hombros.\n• Realiza el máximo rango de recorrido posible, valorando la flexión de rodilla, busca en la medida de lo posible comprimir isquios y gemelos en cada repetición.\n• Evita que se te despeguen los talones de la plataforma y que tus rodillas colapsen\n• Piensaenadelantarlaspuntas de tus pies con las rodillas."
  },
  {
    "source_row": 303,
    "source_order": 13,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Belt squat",
    "reference_url": "https://www.sergiomcoach.com/topics/13-belt-squat-2/",
    "cues": "• Mientras empujas hacia arriba y piensa en empujar hacia delante con tus pies con la intención “tirarte” hacia atrás con la espalda durante la fase concéntrica.\n• Encasodetenerunapoyodemanos, puedes utilizarlo para estar más estable, pero simplemente a modo de apoyo no empujes con los brazos.\nRealiza el movimiento lo máximo posible dentro del plano sagital, lleva las rodillas lo más “hacia delante” posible. Evita que se abran o colapsen\nRango estrella\n* 8-14 repeticiones\n• Piensa en aplastar tus gemelos y tus isquiosurales para trabajar con flexión de rodilla completa.\n• Busca un stance cómodo en cuanto a anchura y distancia de pies respecto a la barra que maximice el rango de movimiento."
  },
  {
    "source_row": 304,
    "source_order": 14,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Sentadilla búlgara libre con barra",
    "reference_url": "https://www.sergiomcoach.com/topics/14-sentadilla-bulgara-libre-con-barra-2/",
    "cues": "• Trata de mantener el torso vertical y perpendicular al suelo.\n• Aplica fuerza hacia delante y hacia abajo con el pie para subir.\n• Busca la máxima flexión de rodilla, adelanta la rodilla todo lo que puedas respecto a la punta del pie. Puedes utilizar un tacón."
  },
  {
    "source_row": 305,
    "source_order": 15,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Safety Bar Squat",
    "reference_url": "https://www.sergiomcoach.com/topics/15-safety-bar-squat-2/",
    "cues": "• Empuja las manetas hacia arriba para mantener los codos ligeramente hacia delante.\n• Busca dentro de lo posible mantener la verticalidad del torso, aunque dependerá de la carga y rango de reps.\n• Mantén una ligera rotación externa de cadera y empuja el suelo, centrándote en la extensión de rodilla, evita compensar llevando la cadera muy atrás."
  },
  {
    "source_row": 306,
    "source_order": 16,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Sentadilla libre barra alta",
    "reference_url": "https://www.sergiomcoach.com/topics/16-sentadilla-libre-barra-alta-2/",
    "cues": "• Busca dentro de lo posible, adelantar al máximo la rodilla respecto a la punta del pie, mantener la verticalidad y comprimir tus isquios con tus gemelos.\n• Realiza bracing, utiliza tu respiración para hacerte un bloque compacto.\n• Rota externamente tu cadera, pies apuntan a las 10 y 10 y empuja fuerte el suelo con triple apoyo (pulgar, meñique y talón)."
  },
  {
    "source_row": 307,
    "source_order": 17,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "High Step Up",
    "reference_url": "https://www.sergiomcoach.com/topics/17-high-step-up-2/",
    "cues": "• Mantén el torso vertical y busca adelantar la rodilla respecto a la punta del pie para favorecer la extensión de rodilla sobre la extensión de cadera.\n• Evita fuerzas inerciales en la medida de lo posible, no rebotes en el suelo con un salto entre repeticiones.\n• Baja del cajón de forma lenta y controlada.\n• No pongas un cajón excesivamente alto."
  },
  {
    "source_row": 308,
    "source_order": 18,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Vertical Leg Press",
    "reference_url": "https://www.sergiomcoach.com/topics/18-vertical-leg-press-prensa-vertical-2/",
    "cues": "• Mantén los pies lo más abajo posible en la plataforma sin despegar los talones. Podrías beneficiarte del uso de tacón en algunos casos.\n• Busca la máxima profundidad y flexión de rodilla, pero sin rebotes ni inercias.\n• Usa menos carga que una prensa 45o, pues al tratarse de una carga 100% gravitacional vertical, requerimos una menor carga para generar la misma tensión."
  },
  {
    "source_row": 309,
    "source_order": 19,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Reverse V Squat",
    "reference_url": "https://www.sergiomcoach.com/topics/19-reverse-v-squat-2/",
    "cues": "• Mantén el torso vertical durante todo el recorrido.\n• Preferentemente los talones deben estar más elevados que la punta del pie.\n• Busca el mayor ROM activo posible para el cuádriceps."
  },
  {
    "source_row": 310,
    "source_order": 20,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "V squat",
    "reference_url": "https://www.sergiomcoach.com/topics/20-v-squat-2/",
    "cues": "• Mantén la espalda pegada al respaldo en la medida de lo posible.\n• Empuja con los pies hacia delante y hacia abajo a la vez.\n• Busca la máxima flexión de rodilla posible que te permita la máquina."
  },
  {
    "source_row": 311,
    "source_order": 21,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Sissy Squat",
    "reference_url": "https://www.sergiomcoach.com/topics/21-sissy-squat-2/",
    "cues": "• Mantén la cadera extendida en todo momento.\n• Coloca los pies a la altura del ancho biacromial con ligera rotación externa.\n• Realiza la fase excéntrica de puntillas y ve apoyando progresivamente los talones conforme llegamos al final de la fase concéntrica.\n• Apóyate con la mano sobre una superficie estable."
  },
  {
    "source_row": 312,
    "source_order": 22,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Hatfield Squat",
    "reference_url": "https://www.sergiomcoach.com/topics/22-hatfield-squat-2/",
    "cues": "• Busca la mayor verticalidad del torso posible, evita inclinarte muy hacia delante.\n• Apoya las manos, pero no empujes con ellas todo lo que puedas, busca estabilizar NO lo conviertas en un ejercicio de tríceps.\n• Busca dar la máxima flexión de rodilla posible, intenta comprimir tus gemelos con tus isquios."
  },
  {
    "source_row": 313,
    "source_order": 23,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Sissy Squat en Silla Romana",
    "reference_url": "https://www.sergiomcoach.com/topics/23-sissy-squat-en-silla-romana-2/",
    "cues": "• Busca flexionar todo lo que puedas tu rodilla, un error común es bajar inclinando el torso y flexionando la cadera en lugar de “doblando” tus rodillas.\n• No pienses en “tirarte” hacia atrás, si no en llevar tus glúteos a tus talones.\n•Puedes utilizar una carga para realizar el ejercicio a medida que progreses."
  },
  {
    "source_row": 314,
    "source_order": 24,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Platz Hack Squat",
    "reference_url": "https://www.sergiomcoach.com/topics/24-platz-hack-squat-2/",
    "cues": "• Busca adelantar lo máximo posible tus rodillas respecto a las puntas de tus pies.\n• Piensa en comprimir tus gemelos con tus isquios, llevando los glúteos a los talones.\n• Es normal que se despeguen tus talones, coloca los pies lo más bajo que puedas en la plataforma sin perder la estabilidad.\n• Busca máxima profundidad manteniendo la cadera extendida."
  },
  {
    "source_row": 315,
    "source_order": 25,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Platz Squat en multipower",
    "reference_url": "https://www.sergiomcoach.com/topics/25-platz-squat-en-multipower-2/",
    "cues": "• Busca adelantar lo máximo posible tus rodillas respecto a las puntas de tus pies.\n• Piensa en comprimir tus gemelos con tus isquios, llevando los glúteos a los talones.\n• Busca máxima profundidad manteniendo el torso lo más vertical posible.\n• Empuja hacia delante con los dedos de los pies y contra el suelo durante la fase concéntrica."
  },
  {
    "source_row": 316,
    "source_order": 26,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Kneeling Leg",
    "reference_url": "https://www.sergiomcoach.com/topics/26-kneeling-leg-extensions-2/",
    "cues": "• Realiza las fases excéntrica y concéntrica de forma controlada.\n• Evita curvar en exceso tu columna lumbar, busca mantener la espalda compacta.\n• Lleva el movimiento concéntrico hasta situar las rodillas a 90o, no tiene sentido avanzar más.\n• Busca darle el máximo estiramiento que puedas al cuádriceps y mantén la cadera extendida."
  },
  {
    "source_row": 317,
    "source_order": 27,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Hatfield Split Squat",
    "reference_url": "https://www.sergiomcoach.com/topics/27-hatfield-split-squat-2/",
    "cues": "• Busca mantener durante todo el ejercicio la máxima verticalidad del torso posible, evitando inclinarte excesivamente hacia delante\n• Apoya las manos buscando generar estabilidad pero no lo conviertas en unos fondos para tríceps, aporta estabilidad sin generar excesiva fuerza.\n• Busca comprimir al máximo tus isquiosurales con tus gemelos, trata de adelantar la rodilla hacia delante dando máxima flexión posible."
  },
  {
    "source_row": 318,
    "source_order": 28,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Sentadilla frontal",
    "reference_url": "https://www.sergiomcoach.com/topics/28-sentadilla-frontal-2/",
    "cues": "• Piensa en sacar pecho durante el movimiento, sin hundirte hacia delante.\n• Busca mantener los codos “altos” durante todo el movimiento\n• Mantén la verticalidad del torso lo máximo posible durante todo el movimiento\n• Piensa en comprimir en la medida de lo posible los isquios con tus gemelos"
  },
  {
    "source_row": 319,
    "source_order": 29,
    "muscle_order": 12,
    "muscle_group": "CUÁDRICEPS",
    "name": "Prensa pendular",
    "reference_url": "https://www.sergiomcoach.com/topics/29-prensa-pendular-2/",
    "cues": "• Coloca el respaldo ligeramente tumbado si puedes, no lo pongas muy inclinado\n• Sitúa tus pies en el punto más bajo y cómodo posible con una anchura similar a la de tus hombros\n• Piensa en llevar las rodillas hacia adelante en relación a los pies y en comprimir los isquios y los gemelos a medida que bajas."
  },
  {
    "source_row": 321,
    "source_order": 1,
    "muscle_order": 13,
    "muscle_group": "ISQUIOSURALES",
    "name": "Peso muerto Rumano RDL",
    "reference_url": "https://www.sergiomcoach.com/topics/1-peso-muerto-rumano-rdl-2/",
    "cues": "• Piensa en “llevar la cadera hacia atrás y arriba” y la barra descenderá sola.\n• No pienses en “bajar la barra”, según tu anatomía la profundidad será mayor o menor. Para una vez que el movimiento deja de producirse desde la cadera.\n• Manténlabarraconstantemente rozando tus tibias y muslos en ambas fases.\n• Mantén la espalda compacta, neutra y apretada piensa que tienes una moneda en las axilas y no debes dejar que caiga. Realiza depresión escapular.\n• La espalda alta puede “redondearse” en la parte alta del movimiento, para mantener hombros en la línea perpendicular que forma el suelo con tu cadera."
  },
  {
    "source_row": 322,
    "source_order": 2,
    "muscle_order": 13,
    "muscle_group": "ISQUIOSURALES",
    "name": "Peso muerto Piernas Rígidas SLDL",
    "reference_url": "https://www.sergiomcoach.com/topics/2-peso-muerto-piernas-rigidas-sldl-2/",
    "cues": "• Piensa en “llevar la cadera hacia atrás y arriba” y la barra descenderá sola.\n• Despega la barra ligeramente de ti especialmente en la excéntrica, puedes tocar el suelo o no, según comodidad y anatomía. No dobles apenas las rodillas.\n• Mantén la espalda compacta, neutra y apretada, realiza depresión escapular.\n• La espalda alta puede “redondearse” en la parte alta del movimiento, para mantener hombros en la línea perpendicular que forma el suelo con tu cadera."
  },
  {
    "source_row": 323,
    "source_order": 3,
    "muscle_order": 13,
    "muscle_group": "ISQUIOSURALES",
    "name": "Peso muerto unilateral con mancuerna",
    "reference_url": "https://www.sergiomcoach.com/topics/3-peso-muerto-unilateral-con-mancuerna-2/",
    "cues": "• Céntrate en llevar la cadera hacia atrás y arriba.\n• Aleja la mancuerna ligeramente más de ti en la parte baja del movimiento.\n• Busca estabilizar con la mano libre si usas 1 mancuerna. Y con la pierna libre en cualquier caso, si genera inestabilidad puede valorarse la variante b-stance DL."
  },
  {
    "source_row": 324,
    "source_order": 4,
    "muscle_order": 13,
    "muscle_group": "ISQUIOSURALES",
    "name": "Buenos días con multipower",
    "reference_url": "https://www.sergiomcoach.com/topics/4-buenos-dias-en-multipower-2/",
    "cues": "•Mantén las rodillas prácticamente extendidas, no las flexiones para bajar más.\n• Piensa en llevar la cadera atrás y arriba, no en bajar la barra hacia abajo.\n• Mantén la espalda compacta y neutra. Sólo debe moverse la cadera."
  },
  {
    "source_row": 325,
    "source_order": 5,
    "muscle_order": 13,
    "muscle_group": "ISQUIOSURALES",
    "name": "Leg Curl tumbado",
    "reference_url": "https://www.sergiomcoach.com/topics/5-leg-curl-tumbado-2/",
    "cues": "• No despegues la cadera del asiento ni la muevas.\n• Piensa en “doblar la rodilla” como si quisieras tocar tus isquios con tus gemelos.\n• Mantener los tobillos en flexión activa puede ayudar generando mayor estabilidad sobre la rodilla. También evitara que se te carguen los gemelos.\n• Agarra fuerte las manetas, traccionando de ellas para estar más estable."
  },
  {
    "source_row": 326,
    "source_order": 6,
    "muscle_order": 13,
    "muscle_group": "ISQUIOSURALES",
    "name": "Leg curl sentado",
    "reference_url": "https://www.sergiomcoach.com/topics/6-leg-curl-sentado-2/",
    "cues": "• Empuja fuertemente las manetas y aplica fuerza con tu torso y cadera contra el respaldo, para que no se extienda y permanecer anclado con la cadera en flexión.\n• Piensa en llevar tus gemelos a tocar tus isquiosurales.\n• Realiza una excéntrica controlada, evita dejar que la almohadilla se vaya rápido y busca sentir bien el estiramiento sobre los isquios.\n• Mantener los tobillos en flexión activa puede ayudar generando mayor estabilidad sobre la rodilla. También evitara que se te carguen los gemelos."
  },
  {
    "source_row": 327,
    "source_order": 7,
    "muscle_order": 13,
    "muscle_group": "ISQUIOSURALES",
    "name": "Leg curl tumbado con mancuerna",
    "reference_url": "https://www.sergiomcoach.com/topics/7-leg-curl-tumbado-con-mancuerna-2/",
    "cues": "• No despegues la cadera del asiento ni la muevas. Valora declinar el banco.\n• Piensa en “doblar la rodilla” como si quisieras tocar tus isquios con tus gemelos.\n• No realices el rango de movimiento completo, traspasar con la mancuerna la línea vertical de la rodilla con el suelo no aportará tensión a tus isquios, al revés."
  },
  {
    "source_row": 328,
    "source_order": 8,
    "muscle_order": 13,
    "muscle_group": "ISQUIOSURALES",
    "name": "Hiperextensiones 45º foco isquiosurales",
    "reference_url": "https://www.sergiomcoach.com/topics/8-hiperextensiones-foco-isquiosurales-2/",
    "cues": "• Coloca la parte superior del banco por debajo de las caderas.\n• Coloca puntas de los pies y rodillas en la dirección del movimiento no hacia fuera.\n• Realiza una ligera flexión de rodilla al final del recorrido.\n• No es necesario extender más allá de alinear tus hombros con tu cadera."
  },
  {
    "source_row": 329,
    "source_order": 9,
    "muscle_order": 13,
    "muscle_group": "ISQUIOSURALES",
    "name": "Buenos días con barra libre",
    "reference_url": "https://www.sergiomcoach.com/topics/9-buenos-dias-con-barra-libre-2/",
    "cues": "• Mantén las rodillas prácticamente extendidas, no las flexiones en exceso.\n• Piensa en llevar la cadera hacia arriba y atrás, NO en descender la barra.\n• Evita realizar una excesiva lordosis o curvatura lumbar, mantén la espalda compacta y neutra. El movimiento debe partir de la CADERA.\n• En caso de ser posible utiliza una safety bar para mayor comodidad."
  },
  {
    "source_row": 330,
    "source_order": 10,
    "muscle_order": 13,
    "muscle_group": "ISQUIOSURALES",
    "name": "Peso muerto unilateral con barra",
    "reference_url": "https://www.sergiomcoach.com/topics/10-peso-muerto-unilateral-con-barra-2/",
    "cues": "• Céntrate en llevar la cadera hacia atrás y arriba.\n• Añade anteversión pélvica en la medida de lo posible\n• Aleja la barra ligeramente más de ti en la parte baja del movimiento\n• Si quieres realizarlo y te genera mucha inestabilidad puede valorarse la variante b-stance DL."
  },
  {
    "source_row": 331,
    "source_order": 11,
    "muscle_order": 13,
    "muscle_group": "ISQUIOSURALES",
    "name": "Leg curl en polea de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/11-leg-curl-en-polea-de-pie-2/",
    "cues": "• Agárrate a un poste o similar para generar la máxima estabilidad\n• Busca llevar tu gemelo a chocar con tu isquiosural\n• Aguanta la contracción ligeramente arriba, evita que el movimiento sea rápido y descontrolado.\n• Evita que el cable se mueva por acción de la cadera, déjala fija y centra el movimiento en la rodilla.\n• Puede ayudarte mantener el tobillo en flexión durante todo el movimiento."
  },
  {
    "source_row": 332,
    "source_order": 12,
    "muscle_order": 13,
    "muscle_group": "ISQUIOSURALES",
    "name": "Leg curl en máquina de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/12-leg-curl-en-maquina-de-pie-2/",
    "cues": "• Busca llevar tu talón hacia tu glúteo.\n• Añadir una ligera flexión de tobillo puede ayudarte.\n• Evita rebotes en la máquina, realiza un movimiento controlado.\n• Busca llevar tu gemelo a chocar con tu isquiosural."
  },
  {
    "source_row": 333,
    "source_order": 13,
    "muscle_order": 13,
    "muscle_group": "ISQUIOSURALES",
    "name": "Glute Ham Raises énfasis isquiosurales",
    "reference_url": "https://www.sergiomcoach.com/topics/13-glute-ham-raise-enfasis-isquosurales-2/",
    "cues": "• Resiste la fase excéntrica, aguanta la caída ejerciendo fuerza con tus isquios.\n• Piensa en doblar la rodilla, piensa que estás haciendo un leg curl y lleva tu cuerpo atrás gracias a pivotar con ella sobre el banco.\n• No es necesario que tu torso esté perpendicular o pase totalmente a la rodilla."
  },
  {
    "source_row": 334,
    "source_order": 14,
    "muscle_order": 13,
    "muscle_group": "ISQUIOSURALES",
    "name": "Peso muerto Rumano con mancuernas",
    "reference_url": "https://www.sergiomcoach.com/topics/14-peso-muerto-rumano-con-mancuernas-rdl-con-mancuernas-2/",
    "cues": "• Piensa en llevar la cadera atrás y arriba, no en bajar las mancuernas hacia el suelo, eso debe ser la consecuencia.\n• “Vuelca” tu pelvis como si fuera un vaso de agua, realiza anteversión para darle más estiramiento a tus isquiosurales\n• Mantén tu espalda compacta, dorsal contraído y las escapulas descendidas\n• La espalda alta puede redondearse ligeramente en la parte alta del movimiento para mantener tus hombros en línea con tu cadera."
  },
  {
    "source_row": 335,
    "source_order": 15,
    "muscle_order": 13,
    "muscle_group": "ISQUIOSURALES",
    "name": "Peso muerto en máquina",
    "reference_url": "https://www.sergiomcoach.com/topics/15-peso-muerto-en-maquina-2/",
    "cues": "• Piensa en llevar la cadera atrás y arriba, no en bajar las manos hacia el suelo, eso debe ser la consecuencia.\n• “Vuelca” tu pelvis como si fuera un vaso de agua, realiza anteversión para darle más estiramiento a tus isquiosurales\n• No dejes caer los hombros en exceso, aprieta las axilas como si tuvieras una moneda en ellas y que quieres que se caiga."
  },
  {
    "source_row": 336,
    "source_order": 16,
    "muscle_order": 13,
    "muscle_group": "ISQUIOSURALES",
    "name": "Slide Leg Curl",
    "reference_url": "https://www.sergiomcoach.com/topics/16-slide-leg-curl-2/",
    "cues": "• Mantén glúteo y abdomen contraídos para centrar el movimiento en la rodilla.\n• Piensa en estirar casi o por completo la rodilla y después en llevar el talón hacia tu glúteo.\n• Busca realizar un movimiento fluído, si a 2 piernas es demasiado sencillo puedes realizarlo a 1 pierna."
  },
  {
    "source_row": 337,
    "source_order": 17,
    "muscle_order": 13,
    "muscle_group": "ISQUIOSURALES",
    "name": "Buenos días con Safety Bar",
    "reference_url": "https://www.sergiomcoach.com/topics/17-buenos-dias-con-safety-bar-2/",
    "cues": "• Mantén las rodillas prácticamente extendidas, evita flexionarlas en exceso.\n• Piensa en llevar la cadera atrás y arriba en diagonal, no en bajar la barra. Imagina que tienes una pared detrás de ti que quieres tocar con el glúteo.\n• “Vuelca” tu pelvis como si fuera un vaso de agua, realiza anteversión para darle más estiramiento a tus isquiosurales.\n• Evita realizar una excesiva lordosis o curvatura lumbar, mantén la espalda neutra. El movimiento debe partir de la CADERA."
  },
  {
    "source_row": 339,
    "source_order": 1,
    "muscle_order": 14,
    "muscle_group": "GEMELOS",
    "name": "Elevaciones de talón en déficit en multipower",
    "reference_url": "https://www.sergiomcoach.com/topics/1-elevaciones-de-talon-en-deficit-en-multipower-2/",
    "cues": "• Realiza un movimiento completo al que puedes añadir una ligera pausa en estiramiento durante la fase excéntrica.\n• Contrae de forma potente extendiendo el tobillo, pudiendo añadir una contracción isométrica o pausa arriba.\n• No tengas prisa, realiza el movimiento controlado sin aprovechar inercias o energía elástica."
  },
  {
    "source_row": 340,
    "source_order": 2,
    "muscle_order": 14,
    "muscle_group": "GEMELOS",
    "name": "Elevaciones de talón unilaterales con mancuerna en déficit",
    "reference_url": "https://www.sergiomcoach.com/topics/2-elevaciones-de-talon-unilaterales-con-mancuerna-en-deficit-2/",
    "cues": "• Realiza un rango de movimiento lo más completo posible.\n• Añade una ligera pausa al final tanto de la fase excéntrica como de la concéntrica.\n• No tengas prisa, realiza el movimiento lento y controlado sin aprovechar inercias o energía elástica.\n• Apoya tu mano libre en algo para generar estabilidad, y mantén el codo que sujeta la mancuerna extendido para no cargar el bíceps."
  },
  {
    "source_row": 341,
    "source_order": 3,
    "muscle_order": 14,
    "muscle_group": "GEMELOS",
    "name": "Sóleo sentado con mancuerna",
    "reference_url": "https://www.sergiomcoach.com/topics/3-soleo-sentado-con-mancuerna-2/",
    "cues": "• Mantén las rodillas dobladas durante el ejercicio no muevas el apoyo de pies.\n• Añade una pausa tanto al final de la fase concéntrica como de la excéntrica, evitando rebotes o hacer el movimiento demasiado rápido.\n• Piensa en “elevar” hacia arriba las mancuernas usando tus rodillas."
  },
  {
    "source_row": 342,
    "source_order": 4,
    "muscle_order": 14,
    "muscle_group": "GEMELOS",
    "name": "Gemelo en prensa",
    "reference_url": "https://www.sergiomcoach.com/topics/4-gemelo-en-prensa-2/",
    "cues": "• Realiza un rango de movimiento lo más completo posible.\n• Clávate contra el respaldo y el asiento. Agarra las manetas para poder estar más estable.\n• Añade una ligera pausa al final tanto de la fase excéntrica como de la concéntrica.\n• Realiza el movimiento lento y controlado sin aprovechar inercias o energía elástica.\n• Piensa en “alejar” el carro de la prensa lo máximo posible de ti."
  },
  {
    "source_row": 343,
    "source_order": 5,
    "muscle_order": 14,
    "muscle_group": "GEMELOS",
    "name": "Gemelo en máquina inclinada",
    "reference_url": "https://www.sergiomcoach.com/topics/5-gemelo-en-maquina-inclinada-2/",
    "cues": "• Realiza un rango de movimiento lo más completo posible.\n• Clávate contra el respaldo y el asiento. Agarra las manetas para poder estar más estable.\n• Añade una ligera pausa al final tanto de la fase excéntrica como de la concéntrica.\n• Realiza el movimiento lento y controlado sin aprovechar inercias o energía elástica.\n• Piensa en alejarte lo máximo posible de los tobillos, dejando las rodillas fijas."
  },
  {
    "source_row": 344,
    "source_order": 6,
    "muscle_order": 14,
    "muscle_group": "GEMELOS",
    "name": "Elevaciones de talón unilaterales en multiupower en déficit",
    "reference_url": "https://www.sergiomcoach.com/topics/6-elevaciones-de-talon-unilaterales-en-multipower-en-deficit-2/",
    "cues": "• Realiza un movimiento lo más completo posible, piensa en “tocar” el suelo con el talón sin llegar a realizarlo.\n• Añade una pausa en el máximo estiramiento y acortamiento para evitar realizar el ejercicio con rebotes e impulsos, lo que restaría estímulo al músculo.\n• Mantén la rodilla extendida, el movimiento lo realiza únicamente el tobillo."
  },
  {
    "source_row": 345,
    "source_order": 7,
    "muscle_order": 14,
    "muscle_group": "GEMELOS",
    "name": "Gemelo en máquina de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/7-gemelo-en-maquina-de-pie-2/",
    "cues": "• Elimina las fuerzas inerciales en todas las repeticiones, realiza un movimiento controlado y sin rebotes.\n• Evita doblar la rodilla o hundirlas en la fase excéntrica para dar sensación de mayor ROM, piensa en descender al máximo tus talones.\n• Añade una pausa al final de las fases excéntrica y concéntrica."
  },
  {
    "source_row": 346,
    "source_order": 8,
    "muscle_order": 14,
    "muscle_group": "GEMELOS",
    "name": "Gemelo en máquina sentado",
    "reference_url": "https://www.sergiomcoach.com/topics/8-gemelo-en-maquina-sentado-2/",
    "cues": "• Elimina posibles rebotes añadiendo una pausa al final de las fases concéntricas y excéntrica.\n• Evita que el movimiento sea demasiado rápido, siente cada repetición.\n• Piensa en llevar tus rodillas lo más alto posible."
  },
  {
    "source_row": 347,
    "source_order": 9,
    "muscle_order": 14,
    "muscle_group": "GEMELOS",
    "name": "Gemelo en multipower sentado",
    "reference_url": "https://www.sergiomcoach.com/?post_type=sfwd-topic&p=2676",
    "cues": "• Mantén las rodillas dobladas durante todo el ejercicio, no muevas el apoyo de pies. Sitúalos de forma que tus rodillas formen un ángulo de a 90º\n• Añade una pausa al final de la fase excéntrica y concéntrica de forma que evites realizar rebotes o hacer un movimiento descontrolado. \n• Piensa en “subir” tus rodillas hacia el techo, no en adelantarlas.\n• Utiliza un acolchado y acompaña la barra con las manos para estar más estable"
  },
  {
    "source_row": 349,
    "source_order": 1,
    "muscle_order": 15,
    "muscle_group": "ADUCTORES",
    "name": "Aductor en máquina V1",
    "reference_url": "https://www.sergiomcoach.com/topics/1-aductor-en-maquina-v1-2/",
    "cues": "• Realiza un movimiento controlado, evita chocar los apoyos de las piernas entre sí rebotando, o realizar una fase excéntrica demasiado rápida.\n• Agarra fuerte las manetas para clavarte en el asiento y tener una posición estable\n• Empuja tu cuerpo contra el asiento a la vez que juntas las rodillas\n• Busca el máximo ROM posible sin dorlor, pero con tensión."
  },
  {
    "source_row": 350,
    "source_order": 2,
    "muscle_order": 15,
    "muscle_group": "ADUCTORES",
    "name": "Aductor en máquina V2",
    "reference_url": "https://www.sergiomcoach.com/topics/2-aductor-en-maquina-v2-2/",
    "cues": "• Empuja tu cuerpo contra el asiento y agarra fuerte las manetas para generar mayor estabilidad y asegurarte contra el asiento.\n• Piensa en juntar fuerte ambas rodillas, aguanta ligeramente la contracción antes de inciar la fase excéntrica.\n• Busca maximizar el ROM, separa las rodillas todo lo que puedas sin dolor y manteniendo la tensión."
  },
  {
    "source_row": 351,
    "source_order": 3,
    "muscle_order": 15,
    "muscle_group": "ADUCTORES",
    "name": "Aductor en polea de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/3-aductor-en-polea-de-pie-2/",
    "cues": "• Resiste la fase excéntrica y busca dar amplitud y estiramiento al movimiento.\n• Piensa en llevar el pie del lado que trabaja más allá del pie de apoyo.\n• Agarra un soporte para generar estabilidad ya que el apoyo es de 1 sóla pierna.\n• Aguanta de forma isométrica en el máximo acortamiento antes de descender."
  },
  {
    "source_row": 352,
    "source_order": 4,
    "muscle_order": 15,
    "muscle_group": "ADUCTORES",
    "name": "Copenaghen Adductions",
    "reference_url": "https://www.sergiomcoach.com/topics/4-copenaghen-adductions-2/",
    "cues": "• Mantén el abdomen contraído y el core en tensión.\n• Piensa en juntar fuerte ambas piernas, las 2 deben ejercer fuerza.\n• Aguanta isométricamente en cada repetición y desciende de forma controlada."
  },
  {
    "source_row": 353,
    "source_order": 5,
    "muscle_order": 15,
    "muscle_group": "ADUCTORES",
    "name": "Aductor en máquina de pie",
    "reference_url": "https://www.sergiomcoach.com/topics/5-aductor-en-maquina-de-pie-2/",
    "cues": "• Busca trabajar con el máximo rango de movimiento posible, sin dolor.\n• Piensa en llevar tu pie o tibia hacia el pie contrario.\n• Agarra los soportes con tus manos fuertemente para generar estabilidad.\n• Realiza una fase excéntrica controlada, nada de rebotes e impulsos."
  },
  {
    "source_row": 355,
    "source_order": 1,
    "muscle_order": 16,
    "muscle_group": "CALENTAMIENTO",
    "name": "Ejercicio calentamiento ejemplo 1",
    "reference_url": "",
    "cues": ""
  },
  {
    "source_row": 358,
    "source_order": 1,
    "muscle_order": 17,
    "muscle_group": "EJ. ACCESORIOS",
    "name": "Ejercicio accesorio ejemplo 1",
    "reference_url": "",
    "cues": ""
  }
]$exercise_catalog$::jsonb) as source(
  source_row integer,
  source_order integer,
  muscle_order integer,
  muscle_group text,
  name text,
  reference_url text,
  cues text
)
on conflict (source_row) do update set
  source_order = excluded.source_order,
  muscle_order = excluded.muscle_order,
  muscle_group = excluded.muscle_group,
  name = excluded.name,
  reference_url = excluded.reference_url,
  cues = excluded.cues;
