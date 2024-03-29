import * as React from "react";

export const useBulkSelect = (data: any) => {
  const [items, setItems] = React.useState<string[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  React.useEffect(() => reset(), [data]);

  const reset = () => {
    setItems([]);
    setSelectedItems([]);
  };

  const toggleItem = (id: string) => {
    const shouldCheck = !selectedItems.includes(id);

    shouldCheck && setSelectedItems((oldSelectedItems) => [...oldSelectedItems, id]);
    !shouldCheck && setSelectedItems((oldSelectedItems) => oldSelectedItems.filter((item) => item !== id));
  };

  const CheckboxBulkSelectAll: React.FC<{ disabled?: boolean }> = ({ disabled }) => (
    <input
      type="checkbox"
      checked={items.length > 0 && items.length === selectedItems.length}
      onChange={(e) => setSelectedItems(e.target.checked ? items : [])}
      disabled={!items.length || disabled}
    />
  );

  const CheckboxBulkSelectOne: React.FC<{ id: string; disabled?: boolean }> = ({ id, disabled }) => {
    React.useEffect(() => {
      if (items.includes(id)) return; // already registered

      setItems((items) => [...items, id]);
    }, [id]);

    return <input type="checkbox" checked={selectedItems.includes(id)} disabled={disabled} readOnly />; // readOnly due to it being controlled elsewhere
  };

  return { selectedItems, CheckboxBulkSelectAll, CheckboxBulkSelectOne, toggleItem };
};
