import { computed, type Ref } from 'vue'

/**
 * Composable for list reordering operations that returns new lists instead of mutating
 * @param list Reactive ref containing the list
 * @returns Object with reordering methods that return new lists
 */
export function useListReordering<T>(list: Ref<T[]>) {
  /**
   * Creates a new reordered list without modifying the original
   * @param item The item to move
   * @param getNewPosition Function that calculates the new position
   * @returns A new array with the reordered items, or null if operation couldn't be performed
   */
  const createReorderedList = (
    item: T,
    getNewPosition: (currentIndex: number, length: number) => number
  ): T[] | null => {
    const items = [...list.value]
    const currentIndex = items.findIndex((listItem) => listItem === item)

    if (currentIndex === -1) return null

    const newIndex = getNewPosition(currentIndex, items.length)
    if (newIndex === currentIndex || newIndex < 0 || newIndex >= items.length) return null

    // Create a new array with the item moved to the new position
    const result = [...items]
    const [removedItem] = result.splice(currentIndex, 1)
    result.splice(newIndex, 0, removedItem)

    return result.map((item, index) => ({
      ...item,
      index
    }))
  }

  return {
    /**
     * Returns a new list with the item moved up one position
     * @param item The item to move up
     * @returns A new list with the item moved, or the original list if the move wasn't possible
     */
    moveUp: (item: T): T[] => {
      return createReorderedList(item, (index) => index - 1) || list.value
    },

    /**
     * Returns a new list with the item moved down one position
     * @param item The item to move down
     * @returns A new list with the item moved, or the original list if the move wasn't possible
     */
    moveDown: (item: T): T[] => {
      return createReorderedList(item, (index) => index + 1) || list.value
    },

    /**
     * Returns a new list with the item moved to the top
     * @param item The item to move to the top
     * @returns A new list with the item moved, or the original list if the move wasn't possible
     */
    moveToTop: (item: T): T[] => {
      return createReorderedList(item, () => 0) || list.value
    },

    /**
     * Returns a new list with the item removed
     * @param item The item to remove
     * @returns A new list without the item, or the original list if the item wasn't found
     */
    removeItem: (item: T): T[] => {
      const items = [...list.value]
      const index = items.findIndex((listItem) => listItem === item)

      if (index === -1) return list.value

      const result = [...items]
      result.splice(index, 1)

      return result.map((item, index) => ({
        ...item,
        index
      }))
    },

    /**
     * Returns a new list with the item moved to the bottom
     * @param item The item to move to the bottom
     * @returns A new list with the item moved, or the original list if the move wasn't possible
     */
    moveToBottom: (item: T): T[] => {
      return createReorderedList(item, (_, length) => length - 1) || list.value
    },

    /**
     * Returns a new list with the item moved to the specified position
     * @param item The item to move
     * @param targetIndex The target index to move the item to
     * @returns A new list with the item moved, or the original list if the move wasn't possible
     */
    moveTo: (item: T, targetIndex: number): T[] => {
      return createReorderedList(item, () => targetIndex) || list.value
    }
  }
}

// Usage example:
// const list = ref([1, 2, 3, 4, 5])
// const { moveUp, moveDown, moveToTop } = useListReordering(list)
//
// // To use it without mutating the original list:
// const newList = moveUp(list.value[2])
//
// // Or to update the original list with the new result:
// list.value = moveUp(list.value[2])
