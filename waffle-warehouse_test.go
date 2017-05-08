package main

import (
	"testing"
	"time"
)

// verify that we have events with these ids, in this order
func (eventSet *EventSet) checkConsistency(t *testing.T, eventIds []string) {
	if len(eventIds) != len(eventSet.events) {
		t.Error(
			"incorrect number of recorded events in event map. expected %d, found %d",
			len(eventIds),
			len(eventSet.events))
	}

	for _, id := range eventIds {
		_, found := eventSet.events[id]
		if !found {
			t.Error(
				"expected to find event %v, not found in events",
				eventSet.events[id])
		}
	}

	if len(eventIds) != len(eventSet.orderedEvents) {
		t.Error(
			"incorrect number of recorded events in ordered events. expected %d, found %d",
			len(eventIds),
			len(eventSet.orderedEvents))
	}

	if !eventSet.isSorted() {
		t.Error("ordered events are not properly sorted")
	}

	i := 0
	j := 0
	for i < len(eventIds) && j < len(eventIds) {
		if eventIds[i] != eventSet.orderedEvents[j].Id {
			t.Error("ordered events not in correct order")
		}
		i++
		j++
	}
}

func TestEventSet(t *testing.T) {
	events := []string{}

	//t.Error("asdf")
	eventSet := NewEventSet()
	event := MakeSimpleEvent("asdf", time.Now())
	eventSet.Put(event)
	events = append(events, "asdf")
	eventSet.checkConsistency(t, events)

	eventSet.Put(event)
	eventSet.checkConsistency(t, events)

	event2 := MakeSimpleEvent("asd", time.Now())
	eventSet.Put(event2)
	events = append(events, "asd")
	eventSet.checkConsistency(t, events)

	eventSet.Put(event2)
	eventSet.checkConsistency(t, events)

	// add an event with an earlier time
	dur, err := time.ParseDuration("-5m")
	if err != nil {
		t.Error("failed to parse duration")
	}
	event3 := MakeSimpleEvent("qwer", time.Now().Add(dur))
	eventSet.Put(event3)

	// put this at the beginning
	events = append([]string{"qwer"}, events...)
	eventSet.checkConsistency(t, events)

	eventSet.Put(event3)
	eventSet.checkConsistency(t, events)
}
