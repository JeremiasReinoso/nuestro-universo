// loader.js — carga archivos JSON desde /data/
async function loadJSON(file) {
  const res = await fetch(`data/${file}`);
  if (!res.ok) throw new Error(`No se pudo cargar ${file}`);
  return res.json();
}
