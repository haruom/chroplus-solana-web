type SleepData = {
  score: number
  totalSleepTime: { hour: number; minute: number }
};
type MonthlySleepData = { [key: number]: SleepData | undefined };

export type CalendarProps = {
  totalScore: number
  data: MonthlySleepData
}
export default function Calendar({ totalScore, data }: CalendarProps) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const toYearMonthString = (d: Date) =>
    new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'long'}).format(d);
  const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

  // 月の初週の日曜日 から 月の1日までの日数
  const emptyDayCount = firstDayOfMonth.getDay();
  // 日曜日から始まる曜日の名前を作る
  const dayNames = (() => {
    const sunday = new Date(year, month, 1 - emptyDayCount);
    return range(0, 6)
      .map(x => { const d = new Date(sunday); d.setDate(sunday.getDate() + x); return d; })
      .map(day => new Intl.DateTimeFormat('en-US', {weekday: 'short'}).format(day))
      .map(day => (<div key={day} className="text-center font-semibold">{day}</div>));
  })();

  // 月の初週の日曜日 から 月の1日までの空白を空divで表す
  const emptyDays = range(1, emptyDayCount).map(key => (<div key={`empty-${key}`}></div>));

  const days = range(1, daysInMonth).map(day => {
    const isToday = year === today.getFullYear()
      && month === today.getMonth()
      && day === today.getDate()
    return (<Day key={day} {...({ day, data: data[day], isToday})} />);
  });
  return (<>
    <h3 className="text-center">{`今月の合計スコア: ${totalScore}`}</h3>
    <details>
    <summary className="text-center">1ヶ月の睡眠時間</summary>
    <div className="lg:w-7/12 md:w-9/12 sm:w-10/12 mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden text-black">
            <div className="flex items-center justify-between px-6 py-3 bg-gray-700">
                <button className="text-white">Previous</button>
                <h2 className="text-white">{toYearMonthString(today)}</h2>
                <button className="text-white">Next</button>
            </div>
            <div className="grid grid-cols-7 gap-2 p-4">
                {dayNames}
                {emptyDays}
                {days}
            </div>
        </div>
    </div>
    </details>    
  </>);
}

type DayProps = {
  day: number
  data: CalendarProps['data'][number]
  isToday: boolean
};
function Day({ day, data, isToday }: DayProps) {
  const defaultCls = 'text-center py-2 border cursor-pointer';
  const whenToday = isToday ? 'bg-blue-500 text-white' : '';

  const score = data?.score ?? 0
  const time = data?.totalSleepTime ?? { hour: '', minute: '' };
  return (
    <div className={`${defaultCls} ${whenToday}`}>
      <div>
        {score > 0 ? <>{`${score}: ${time.hour}h ${time.minute}m`}</> : <>❌</>}
      </div>
      {day}
    </div>
  );
}
