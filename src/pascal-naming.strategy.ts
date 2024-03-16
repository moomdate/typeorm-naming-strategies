// Credits to @recurrence
// https://gist.github.com/recurrence/b6a4cb04a8ddf42eda4e4be520921bd2

import {DefaultNamingStrategy, NamingStrategyInterface} from 'typeorm';
import {snakeCase} from 'typeorm/util/StringUtils';

export class PascalNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface {
  tableName(className: string, customName: string): string {
    return customName ? customName : this.toPasCal(className);
  }

  /**
   * ref https://stackoverflow.com/questions/2970525/converting-a-string-with-spaces-into-camel-case
   * @param string
   */

   isPascalCase(input: string) {
    if (input.charAt(0) !== input.charAt(0).toUpperCase()) {
      return false;
    }

    for (let i = 1; i < input.length; i++) {
      const char = input.charAt(i);
      if (char === ' ' || char === '_') {
        return false;
      }
    }

    return true;
  }

  toPasCal(string: string) {
    if (this.isPascalCase(string))
      return string;

    return `${string}`
      .toLowerCase()
      .replace(new RegExp(/[-_]+/, 'g'), ' ')
      .replace(new RegExp(/[^\w\s]/, 'g'), '')
      .replace(
        new RegExp(/\s+(.)(\w*)/, 'g'),
        ($1, $2, $3) => `${$2.toUpperCase() + $3}`
      )
      .replace(new RegExp(/\w/), s => s.toUpperCase());
  }

  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return (
      snakeCase(embeddedPrefixes.concat('').join('_')) +
      (customName ? customName : snakeCase(propertyName))
    );
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(relationName + '_' + referencedColumnName);
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    secondPropertyName: string,
  ): string {
    return snakeCase(
      firstTableName +
      '_' +
      firstPropertyName.replace(/\./gi, '_') +
      '_' +
      secondTableName,
    );
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return snakeCase(
      tableName + '_' + (columnName ? columnName : propertyName),
    );
  }

  classTableInheritanceParentColumnName(
    parentTableName: any,
    parentTableIdPropertyName: any,
  ): string {
    return snakeCase(parentTableName + '_' + parentTableIdPropertyName);
  }

  eagerJoinRelationAlias(alias: string, propertyPath: string): string {
    return alias + '__' + propertyPath.replace('.', '_');
  }
}
