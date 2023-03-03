import * as React from "react";

export const useBulkSelect = (currentPage: number, data: any) => {
  const [items, setItems] = React.useState<string[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  React.useEffect(() => reset(), [currentPage, data]);

  const reset = () => {
    setItems([]);
    setSelectedItems([]);
  };

  const CheckboxBulkSelectAll: React.FC = () => (
    <input
      type="checkbox"
      checked={items.length > 0 && items.length === selectedItems.length}
      onChange={(e) => setSelectedItems(e.target.checked ? items : [])}
    />
  );

  const CheckboxBulkSelectOne: React.FC<{ id: string }> = ({ id }) => {
    React.useEffect(() => {
      if (items.includes(id)) return; // already registered

      setItems((items) => [...items, id]);
    }, [id]);

    const toggleItem = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
      const checked = e.target.checked;

      checked && setSelectedItems((oldSelectedItems) => [...oldSelectedItems, id]);
      !checked && setSelectedItems((oldSelectedItems) => oldSelectedItems.filter((item) => item !== id));
    };

    return <input type="checkbox" onChange={(e) => toggleItem(e, id)} checked={selectedItems.includes(id)} />;
  };

  return { selectedItems, CheckboxBulkSelectAll, CheckboxBulkSelectOne };
};
