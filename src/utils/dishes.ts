import { CATEGORIES } from '../types';
import type { Category, Dish } from '../types';

export type DishSection = {
  title: Category;
  data: Dish[];
};

export function groupDishesByCategory(dishes: Dish[]): DishSection[] {
  return CATEGORIES.map(title => ({
    title,
    data: dishes.filter(dish => dish.category === title),
  })).filter(section => section.data.length > 0);
}
