import { Calendar, DateHelper, DayView } from '@bryntum/calendar';

/**
 * A DayView which shows a range of days from its configured start date.
 *
 * By default it will show seven days.
 *
 * Its range may be changed by an application.
 *
 * When active, it sets the owning Calendar's date picker to show the range it covers
 * and when the user selects a date in the date picker, it changes its own start date to that date.
 */
export default class MultiDays extends DayView {
    static $name = 'MultiDays';

    static configurable = {
        title : 'Multi Days',

        // Default range is 7 days
        range : '7 d',

        // It cannot have its endDate set
        fixedDuration : true
    };

    // Don't duplicate the month and year name if the start and end are in the same month.
    // eg "May 1 - 3, 2022" insteadf of "May 1 2022 - May 3, 2022"
    get description() {
        const
            me                     = this,
            { startDate, endDate } = me;

        if (DateHelper.diff(startDate, endDate, 'd') > 1) {
            const
                startMonth   = DateHelper.getMonthName(startDate.getMonth()),
                endMonth     = DateHelper.getMonthName(endDate.getMonth()),
                endMonthName = startMonth !== endMonth ? `${endMonth} ` : '';

            // Dont duplicate month name if possible. If same month use eg "May 1 - 3, 2022"
            return `${startMonth} ${startDate.getDate()} - ${endMonthName} ${endDate.getDate() - 1}, ${endDate.getFullYear()}`;
        }
        return super.description;
    }

    previous() {
        this.date = DateHelper.add(this.startDate, -this.duration, 'd');
    }

    next() {
        this.date = this.startDate = DateHelper.add(this.startDate, this.duration, 'd');
    }

    onShow() {
        const { datePicker } = this.calendar.widgetMap;

        super.onShow?.(...arguments);

        // Set the Calendar date picker's range to be the range we cover
        datePicker.setConfig({
            multiSelect : 'range',
            selection   : [
                this.startDate,
                DateHelper.add(this.endDate, -1)
            ]
        });

        // Attempting to select a date results in this view changing its startDate.
        // That s then reflected back to the Calendar's date picker in onRangeChange.
        this.dateListener = datePicker.on({
            beforeDateSelect : ({ date }) => {
                this.startDate = date;
                return false;
            }
        });
    }

    onHide() {
        this.calendar.widgetMap.datePicker.multiSelect = false;
        this.dateListener?.();
        super.onHide?.();
    }

    // When we change range, update the Calendar's date picker to show the range
    onRangeChange({ new : { startDate, endDate } }) {
        this.calendar.widgetMap.datePicker.selection = [startDate, DateHelper.add(endDate, -1)];
    }
}

Calendar.Modes.register('multidays', MultiDays);
