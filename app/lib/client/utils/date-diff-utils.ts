import { startOfDay, startOfToday, subDays } from 'date-fns'

interface Item {
    chatId: string
    title?: string
    updatedAt: Date
}

type GroupedItems = {
    today: Item[]
    yesterday: Item[]
    threeDaysAgo: Item[]
    lastWeek: Item[]
    lastMonth: Item[]
    threeMonthsAgo: Item[]
    lastYear: Item[]
    older: Item[]
}

function groupItemsByUpdateTime(items: Item[]): GroupedItems {
    const today = startOfToday()
    const yesterday = subDays(today, 1)
    const threeDaysAgo = subDays(today, 3)
    const lastWeek = subDays(today, 7)
    const lastMonth = subDays(today, 30)
    const threeMonthsAgo = subDays(today, 90)
    const lastYear = subDays(today, 365)

    const groupedItems: GroupedItems = {
        today: [],
        yesterday: [],
        threeDaysAgo: [],
        lastWeek: [],
        lastMonth: [],
        threeMonthsAgo: [],
        lastYear: [],
        older: [],
    }

    items.forEach((item) => {
        const itemDate = startOfDay(item.updatedAt)

        if (itemDate >= today) {
            groupedItems.today.push(item)
        } else if (itemDate >= yesterday) {
            groupedItems.yesterday.push(item)
        } else if (itemDate >= threeDaysAgo) {
            groupedItems.threeDaysAgo.push(item)
        } else if (itemDate >= lastWeek) {
            groupedItems.lastWeek.push(item)
        } else if (itemDate >= lastMonth) {
            groupedItems.lastMonth.push(item)
        } else if (itemDate >= threeMonthsAgo) {
            groupedItems.threeMonthsAgo.push(item)
        } else if (itemDate >= lastYear) {
            groupedItems.lastYear.push(item)
        } else {
            groupedItems.older.push(item)
        }
    })

    // Sort each group by updateTime in descending order
    for (const key in groupedItems) {
        groupedItems[key as keyof GroupedItems].sort(
            (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
        )
    }

    return groupedItems
}

export default groupItemsByUpdateTime
