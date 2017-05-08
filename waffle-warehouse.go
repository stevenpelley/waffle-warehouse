package main

import (
	"net/http"
	"sort"
	"time"

	"github.com/labstack/echo"
	"github.com/patrickmn/go-cache"
)

type Event struct {
	RequestId  string `json:"requestId"`
	Id         string `json:"id"`
	FoodType   string `json:"foodType"`
	ActionType string `json:"actionType"`
	Time       int64  `json:"time"`
	Count      uint64 `json:"count"`
}

// for testing
func MakeSimpleEvent(id string, time time.Time) *Event {
	event := new(Event)
	event.RequestId = id
	event.Id = id
	event.Time = time.UnixNano()

	event.FoodType = "waffle"
	event.ActionType = "new"
	event.Count = 1

	return event
}

type EventSet struct {
	// cache of request ids we have already handled. If a request arrives we will
	// perform it only if its uuid is not in this cache.
	idCache *cache.Cache

	// the set of all known events mapped by event id
	events map[string]*Event

	// the set of events ordered by event time.
	// the UI event history reflects this list.
	orderedEvents []*Event
}

func NewEventSet() *EventSet {
	set := new(EventSet)
	set.idCache = cache.New(5*time.Minute, 10*time.Minute)
	set.events = make(map[string]*Event)
	set.orderedEvents = make([]*Event, 0)
	return set
}

func (eventSet *EventSet) Put(event *Event) error {
	if eventSet.isIdAlreadyAccepted(event.RequestId) {
		// event has already been accepted
		return nil
	}

	eventSet.idCache.Set(event.RequestId, event, cache.DefaultExpiration)
	eventSet.events[event.Id] = event
	eventSet.placeEventInOrder(event)
	return nil
}

func (eventSet *EventSet) placeEventInOrder(event *Event) {
	var events []*Event = eventSet.orderedEvents

	// check if it's empty or that this is the newest event
	if len(events) == 0 || event.Time > events[len(events)-1].Time {
		eventSet.orderedEvents = append(events, event)
	} else {
		// otherwise figure out where to put it
		var loc int = sort.Search(len(events), func(i int) bool {
			return events[i].Time > event.Time
		})

		// insert this event into the proper spot
		eventSet.orderedEvents = append(eventSet.orderedEvents, nil)
		copy(eventSet.orderedEvents[loc+1:], eventSet.orderedEvents[loc:])
		eventSet.orderedEvents[loc] = event
	}
}

func (eventSet *EventSet) isSorted() bool {
	var events []*Event = eventSet.orderedEvents
	return sort.SliceIsSorted(events, func(i, j int) bool {
		return events[i].Time <= events[j].Time
	})
}

func (eventSet *EventSet) isIdAlreadyAccepted(id string) bool {
	_, found := eventSet.idCache.Get(id)
	return found
}

var eventSet *EventSet

func putEvent(c echo.Context) error {
	id := c.Param("id")

	event := new(Event)
	if err := c.Bind(event); err != nil {
		return c.String(
			http.StatusInternalServerError,
			"problem deserializing input into Event")
	}

	if id != event.Id {
		return c.String(
			http.StatusInternalServerError,
			"id does not match body id")
	}

	if err := eventSet.Put(event); err != nil {
		return c.String(
			http.StatusInternalServerError,
			"problem putting event")
	}

	return c.String(http.StatusOK, "")
}

func getAllEvents(c echo.Context) error {
	return c.JSON(http.StatusOK, eventSet.orderedEvents)
}

func deleteEvent(c echo.Context) error {
	return nil
}

func getTime(c echo.Context) error {
	return c.String(http.StatusOK, time.Now().Format(
		"Mon Jan 2 15:04:05 -0700 MST 2006"))
}

func getWaffleEvents(c echo.Context) error {
	return c.String(http.StatusOK, time.Now().Format(
		"Mon Jan 2 15:04:05 -0700 MST 2006"))
}

func main() {
	eventSet = NewEventSet()
	e := echo.New()
	e.Static("/", "app/build")
	e.GET("/waffle/time", getTime)
	e.GET("/waffle/allEvents", getAllEvents)
	e.PUT("/waffle/event/:id", putEvent)
	e.Logger.Fatal(e.Start(":1323"))
}
