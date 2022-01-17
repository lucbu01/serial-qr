import { KeyValue, Operation } from './data';

export function parseOperationsDefinition(
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

export function parseMultilineOperationsDefinition(
  definition: Operation[],
  lines: KeyValue<string>[]
) {
  const output: Operation[] = [];
  definition.forEach((operation) => {
    if (operation.insert) {
      output.push({
        ...operation,
        insert: parseMultilineDefinition(
          operation.insert as string,
          lines,
          false
        )
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

export function parseMultilineDefinition(
  definition: string,
  lines: KeyValue<string>[],
  trim = true
) {
  return parseDefinition(definition, lines[0], trim).replace(
    /\{\[([^;}\]]+)(?:;([^;}\]]*)(?:;([^;}\]]*))?)?]}/g,
    (_substring, propertyDef, join, joinLast) => {
      const properties = lines.map((line) =>
        extractProperty(propertyDef, line)
      );
      if (properties.length > 1) {
        return `${properties.slice(0, -1).join(join ? join : ', ')}${
          joinLast ? joinLast : ' & '
        }${properties.slice(-1)}`;
      } else {
        return properties[0];
      }
    }
  );
}

export function parseDefinition(
  definition: string,
  line: KeyValue<string>,
  trim = true
): string {
  if (trim) {
    definition = definition.trim();
  }
  return definition.replace(/\{([^[\]}]+)\}/g, (_substring, propertyDef) =>
    extractProperty(propertyDef, line)
  );
}

function extractProperty(propertyDef: string, line: KeyValue<string>): any {
  if (/.+\?:.+/.test(propertyDef)) {
    const res = /(.+)\?:(.+)/.exec(propertyDef);
    if (res) {
      return oneOrOther(res[1].trim(), res[2].trim(), line);
    } else {
      return line[propertyDef.trim()];
    }
  } else {
    return line[propertyDef.trim()];
  }
}

function oneOrOther(prop1: string, prop2: string, member: KeyValue<string>) {
  return member[prop1] ? member[prop1] : member[prop2];
}
