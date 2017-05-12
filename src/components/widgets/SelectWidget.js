import React from "react";
import PropTypes from "prop-types";

import { asNumber } from "../../utils";
import { validate as jsonValidate } from "jsonschema";

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
function processValue({ type, items }, value) {
  if (value === "") {
    return undefined;
  } else if (
    type === "array" &&
    items &&
    ["number", "integer"].includes(items.type)
  ) {
    return value.map(asNumber);
  } else if (type === "boolean") {
    return value === "true";
  } else if (type === "number") {
    return asNumber(value);
  }
  return value;
}

function getValue(event, multiple, enumOptions) {
  if (multiple) {
    const valueIds = [].slice
      .call(event.target.options)
      .filter(o => o.selected)
      .map(o => o.value);
    return [].map.call(valueIds, id => enumOptions[id]);
  } else {
    const valueId = event.target.value;
    if (valueId === "") {
      return "";
    }
    const value = enumOptions[valueId].enum[0];
    return value;
  }
}

function findSelectedSchemas(valueOrValues, schemas, multiple) {
  if (multiple) {
    return Array.map.call(valueOrValues, value =>
      findSelectedSchemas(value, schemas)
    );
  } else {
    if (valueOrValues === undefined) {
      return "";
    }
    for (const schemaId in schemas) {
      console.log(valueOrValues, schemas[schemaId]);
      const { errors } = jsonValidate(valueOrValues, schemas[schemaId]);
      if (errors.length === 0) {
        console.log(errors);
        return String(schemaId);
      }
    }
    return "";
  }
}

function SelectWidget(props) {
  const {
    schema,
    id,
    options,
    value,
    required,
    disabled,
    readonly,
    multiple,
    autofocus,
    onChange,
    onBlur,
    placeholder,
  } = props;
  const selectedSchemas = findSelectedSchemas(
    value,
    options.enumOptions,
    multiple
  );
  const { enumOptions } = options;
  const emptyValue = multiple ? [] : "";
  return (
    <select
      id={id}
      multiple={multiple}
      className="form-control"
      value={selectedSchemas === "" ? emptyValue : selectedSchemas}
      required={required}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      onBlur={
        onBlur &&
          (event => {
            const newValue = getValue(event, multiple, enumOptions);
            onBlur(id, processValue(schema, newValue));
          })
      }
      onChange={event => {
        const newValue = getValue(event, multiple, enumOptions);
        onChange(processValue(schema, newValue));
      }}>
      {!multiple && !schema.default && <option value="">{placeholder}</option>}
      {enumOptions.map(({ title }, i) => {
        return <option key={i} value={`${i}`}>{title}</option>;
      })}
    </select>
  );
}

SelectWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  SelectWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array,
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    multiple: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
  };
}

export default SelectWidget;
