export function camelToScreamingSnake(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
}

export function camelToHumanized(str: string) {
  if (!str || typeof str !== 'string') return str;
  let humanized = str.replace(/([a-z])([A-Z])/g, '$1 $2');

  return humanized.charAt(0).toUpperCase() + humanized.slice(1);
}

export function interpolate(template: string, params: Record<string, any>): string {
  if (!template || typeof params !== 'object') return template;

  return template.replace(/\{\{([\w]+)\}\}/g, (_, key) => {
    return camelToHumanized(params[key.trim()]) ?? `{{${key}}}`;
  });
}
