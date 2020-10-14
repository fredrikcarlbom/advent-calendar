namespace advent_calendar
{
    public class Day
    {
        public int DayNumber { get; set; }
        public bool Enabled {get; set;}
        public string Content { get; set; }
        public Point Position { get; set; }

        public Day(int dayNumber, bool enabled = false, string content = "") {
            DayNumber = dayNumber;
            Enabled = enabled;
            Content = content;
        }
    }

    public struct Point {
        public int X;
        public int Y;
    }
}
