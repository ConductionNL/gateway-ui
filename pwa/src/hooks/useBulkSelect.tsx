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

  const CheckboxBulkSelectAll: React.FC = () => (
    <input
      type="checkbox"
      checked={items.length > 0 && items.length === selectedItems.length}
      onChange={(e) => setSelectedItems(e.target.checked ? items : [])}
      disabled={!items.length}
    />
  );

  const CheckboxBulkSelectOne: React.FC<{ id: string }> = ({ id }) => {
    React.useEffect(() => {
      if (items.includes(id)) return; // already registered

      setItems((items) => [...items, id]);
    }, [id]);

    return <input type="checkbox" onChange={() => toggleItem(id)} checked={selectedItems.includes(id)} />;
  };

  return { selectedItems, CheckboxBulkSelectAll, CheckboxBulkSelectOne, toggleItem };
};
