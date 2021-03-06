import { filtersListNames, filtersLists } from '../constants/filter';

const filterItems = (items, filters) => {
  for (let k of Object.keys(filters)) {
    const filterType = filtersLists.find(
      (filter) => filter.name.toLowerCase() === k
    );

    const filterValue = filterType.lists.find(
      (list) => list.id === Number(filters[k])
    ).value;

    switch (filterType.name) {
      case filtersListNames.PRICE:
        items = items.filter(
          (item) =>
            filterValue.pmin <= item.price && item.price <= filterValue.pmax
        );
        break;
      case filtersListNames.CONDITION:
        items = items.filter(
          (item) => item.condition.toLowerCase() === filterValue
        );
        break;
      case filtersListNames.SHIPPING:
        items = items.filter((item) => item.shipping === filterValue);
        break;
      default:
        break;
    }
  }
  return items;
};

export default filterItems;
