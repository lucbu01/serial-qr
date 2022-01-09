import { KeyValue, Operation } from './data';

export function parseOperationssDefinition(
  definition: Operation[],
  line: KeyValue<string>
) {
  const output: Operation[] = [];
  definition.forEach((operation) => {
    if (operation.insert) {
      output.push({
        ...operation,
        insert: parseDefinition(operation.insert as string, line, false)
      });
    } else {
      output.push({ ...operation });
    }
  });
  return output;
}

export function parseNumberDefinition(
  definition: string,
  line: KeyValue<string>
): number {
  try {
    return parseFloat(parseDefinition(`${definition}`, line));
  } catch (e) {
    return 0;
  }
}

export function parseDefinition(
  definition: string,
  line: KeyValue<string>,
  trim = true
): string {
  if (trim) {
    definition = definition.trim();
  }
  return definition.replace(/\{([^}]+)\}/g, (_substring, propertyDef) =>
    extractProperty(propertyDef, line)
  );
}

function extractProperty(propertyDef: string, member: KeyValue<string>): any {
  if (/.+\?:.+/.test(propertyDef)) {
    const res = /(.+)\?:(.+)/.exec(propertyDef);
    if (res) {
      return oneOrOther(res[1].trim(), res[2].trim(), member);
    } else {
      return member[propertyDef.trim()];
    }
  } else {
    return member[propertyDef.trim()];
  }
}

function oneOrOther(prop1: string, prop2: string, member: KeyValue<string>) {
  return member[prop1] ? member[prop1] : member[prop2];
}
