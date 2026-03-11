import { useCallback, useId, useMemo, useState, memo } from 'react';
import type { Types } from '@a2ui/lit/0.8';
import type { A2UIComponentProps } from '../../types';
import { useA2UIComponent } from '../../hooks/useA2UIComponent';
import { classMapToString, stylesToObject } from '../../lib/utils';

/**
 * MultipleChoice component - a selection component using a dropdown.
 *
 * Renders a <select> element with options, matching the Lit renderer's behavior.
 * Supports two-way data binding for the selected value.
 */
export const MultipleChoice = memo(function MultipleChoice({
  node,
  surfaceId,
}: A2UIComponentProps<Types.MultipleChoiceNode>) {
  const { theme, resolveString, setValue, getValue } = useA2UIComponent(node, surfaceId);
  const props = node.properties;
  const id = useId();
  const [filterText, setFilterText] = useState('');

  const options = (props.options as { label: { literalString?: string; path?: string }; value: string }[]) ?? [];
  const selectionsPath = props.selections?.path;
  const variant = (props.type ?? (props as unknown as { variant?: string }).variant ?? 'checkbox') as
    | 'checkbox'
    | 'chips';
  const filterable = props.filterable ?? false;
  const maxAllowedSelections =
    typeof props.maxAllowedSelections === 'number' ? props.maxAllowedSelections : undefined;
  const literalSelections = Array.isArray(props.selections?.literalArray)
    ? props.selections.literalArray
    : [];

  const currentSelections = useMemo(() => {
    if (selectionsPath) {
      const value = getValue(selectionsPath);
      if (Array.isArray(value)) {
        return value.map(String);
      }
    }
    return literalSelections.map(String);
  }, [getValue, literalSelections, selectionsPath]);

  const description = resolveString(
    (props as unknown as { description?: { literalString?: string; path?: string } }).description
  ) ?? 'Select an item';

  const visibleOptions = useMemo(() => {
    const keyword = filterText.trim().toLowerCase();
    if (!keyword) {
      return options;
    }
    return options.filter((option) => {
      const label = (resolveString(option.label) ?? option.value).toLowerCase();
      return label.includes(keyword) || option.value.toLowerCase().includes(keyword);
    });
  }, [filterText, options, resolveString]);

  const applySelections = useCallback(
    (nextSelections: string[]) => {
      const deduplicated = Array.from(new Set(nextSelections));
      const normalized =
        maxAllowedSelections && maxAllowedSelections > 0
          ? deduplicated.slice(0, maxAllowedSelections)
          : deduplicated;
      if (selectionsPath) {
        setValue(selectionsPath, normalized);
      }
    },
    [maxAllowedSelections, selectionsPath, setValue]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValues = Array.from(e.target.selectedOptions).map(
        (option) => option.value
      );
      const fallbackSelection =
        selectedValues.length === 0 && e.target.value ? [e.target.value] : selectedValues;
      applySelections(fallbackSelection);
    },
    [applySelections]
  );

  const toggleChip = useCallback(
    (value: string) => {
      if (currentSelections.includes(value)) {
        applySelections(currentSelections.filter((item) => item !== value));
      } else {
        applySelections([...currentSelections, value]);
      }
    },
    [applySelections, currentSelections]
  );

  // Apply --weight CSS variable on root div (:host equivalent) for flex layouts
  const hostStyle: React.CSSProperties = node.weight !== undefined
    ? { '--weight': node.weight } as React.CSSProperties
    : {};

  return (
    <div className="a2ui-multiplechoice" style={hostStyle}>
      <section
        className={classMapToString(theme.components.MultipleChoice.container)}
      >
        <label
          htmlFor={id}
          className={classMapToString(theme.components.MultipleChoice.label)}
        >
          {description}
        </label>
        {filterable ? (
          <input
            type="search"
            aria-label="Filter options"
            value={filterText}
            onChange={(event) => setFilterText(event.target.value)}
            className={classMapToString(theme.components.MultipleChoice.element)}
            style={stylesToObject(theme.additionalStyles?.MultipleChoice)}
          />
        ) : null}
        {variant === 'chips' ? (
          <div>
            {visibleOptions.map((option) => {
              const label = resolveString(option.label);
              const selected = currentSelections.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  data-selected={selected ? 'true' : 'false'}
                  className={classMapToString(theme.components.MultipleChoice.element)}
                  style={stylesToObject(theme.additionalStyles?.MultipleChoice)}
                  onClick={() => toggleChip(option.value)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ) : (
          <select
            name="data"
            id={id}
            multiple
            value={currentSelections}
            className={classMapToString(theme.components.MultipleChoice.element)}
            style={stylesToObject(theme.additionalStyles?.MultipleChoice)}
            onChange={handleChange}
          >
            {visibleOptions.map((option) => {
              const label = resolveString(option.label);
              return (
                <option key={option.value} value={option.value}>
                  {label}
                </option>
              );
            })}
          </select>
        )}
      </section>
    </div>
  );
});

export default MultipleChoice;
