import { ToolInvocation } from 'ai'
import { WeatherData } from '@lib/service/utils/weather-utils.ts'
import React from 'react'
import { SearchResults } from '@lib/service/utils/search-utils.ts'

interface ToolcallItemProps {
    toolInvocation: ToolInvocation
}

const ToolcallItem = ({ toolInvocation }: ToolcallItemProps) => {
    if (toolInvocation.toolName == 'getWeatherInformation') {
        return <WeatherInformationItem toolInvocation={toolInvocation} />
    } else if (toolInvocation.toolName == 'search') {
        return <SearchItem toolInvocation={toolInvocation} />
    } else if (toolInvocation.toolName == 'retrieve') {
        return <RetrieveItem toolInvocation={toolInvocation} />
    }
}

const RetrieveItem = ({ toolInvocation }: ToolcallItemProps) => {
    if ('result' in toolInvocation) {
        return (
            <p className="pl-12 text-base font-bold italic text-gray-600">
                Here is the summary of the site:
            </p>
        )
    } else {
        return (
            <div className="flex justify-start pl-10">
                <div className="rounded-[20px] bg-[#2F2F2F] px-4 py-2">
                    <p className="animate-pulse break-all text-lg font-bold italic text-white">
                        Searching {toolInvocation.args.url}
                    </p>
                </div>
            </div>
        )
    }
}

const WeatherInformationItem = ({ toolInvocation }: ToolcallItemProps) => {
    if ('result' in toolInvocation) {
        const result = toolInvocation.result as WeatherData
        if (result.location.name === 'notfound') {
            return null
        }
        return (
            <div
                key={toolInvocation.toolCallId}
                className="flex flex-col gap-4 rounded-lg bg-blue-700 p-4"
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <WeatherIcon
                            localtime={new Date(result.location.localtime)}
                            weatherCondition={result.current.condition.text}
                        />
                        <div className="text-4xl font-medium text-blue-50">
                            {result.current.temp_c}°C
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-lg font-bold">
                            {result.forecast.forecastday[0].date}
                        </div>
                        <div className="text-base">
                            {result.location.localtime}
                        </div>
                    </div>
                </div>
                <div className="flex w-full flex-wrap content-start justify-between gap-y-2 text-blue-50">
                    {result.forecast.forecastday.map((forecast, index) => {
                        const todayBackground = index === 0 ? 'bg-blue-400' : ''
                        return (
                            <div
                                key={forecast.date}
                                className={`flex flex-col items-center rounded-lg px-4 py-2 ${todayBackground}`}
                            >
                                <div className="text-xs">{forecast.date}</div>
                                <div>
                                    {forecast.day.maxtemp_c}° ~{' '}
                                    {forecast.day.mintemp_c}°
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    } else {
        return <WeatherSkeleton />
    }
}

const WeatherIcon = ({
    localtime,
    weatherCondition,
}: {
    localtime: Date
    weatherCondition: string
}) => {
    let weatherIcon: string
    if (localtime.getUTCHours() < 6 || localtime.getUTCHours() > 18) {
        weatherIcon = '🌙'
    } else {
        weatherIcon = '☀️'
    }
    if (weatherCondition.includes('rain')) {
        weatherIcon = '🌧️'
    } else if (weatherCondition.includes('cloud')) {
        weatherIcon = '☁️'
    } else if (weatherCondition.includes('snow')) {
        weatherIcon = '❄️'
    }
    return <div className="text-4xl">{weatherIcon}</div>
}

const WeatherSkeleton = () => {
    return (
        <div className="w-full rounded-lg bg-blue-600 p-4">
            <div className="flex animate-pulse space-x-4">
                <div className="flex-1 space-y-3 py-1">
                    <div className="h-2 rounded bg-blue-300"></div>
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 h-2 rounded bg-blue-300" />
                            <div className="col-span-1 h-2 rounded bg-blue-200" />
                        </div>
                        <div className="h-2 rounded bg-blue-100"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SearchItem = ({ toolInvocation }: ToolcallItemProps) => {
    if ('result' in toolInvocation) {
        const result = toolInvocation.result as SearchResults
        return (
            <p className="pl-12 text-base font-bold italic text-gray-600">
                {result.results.length} results were found.
            </p>
        )
    } else {
        return (
            <div className="flex justify-start pl-10">
                <div className="rounded-[20px] bg-[#2F2F2F] px-4 py-2">
                    <p className="animate-pulse text-lg font-bold italic text-white">
                        Searching {toolInvocation.args.query}
                    </p>
                </div>
            </div>
        )
    }
}

export default ToolcallItem
