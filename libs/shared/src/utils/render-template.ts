export default function renderTemplate(template: string, data: Record<string, string | number>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = data[key as string];
    return value !== undefined ? String(value) : `{{${key}}}`;
  });
}
