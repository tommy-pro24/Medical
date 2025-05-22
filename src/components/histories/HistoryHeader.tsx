import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';

interface HistoryHeaderProps {
    search: string;
    setSearch: (v: string) => void;
    date: DateRange | undefined;
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const HistoryHeader: React.FC<HistoryHeaderProps> = ({ search, setSearch, date, setDate }) => (
    <div className="space-y-4">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl xl:text-3xl font-bold">Inventory History</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search orders..."
                    className="pl-10 w-full"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            <DateRangePicker setDate={setDate} date={date} />
        </div>
    </div>
);

export default HistoryHeader; 