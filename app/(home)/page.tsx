import React from "react";
import Header from "./components/Header";
import QuestTabs from "./components/QuestTabs";
import Activity from "./components/Activity";
import RealtimeListener from "./components/RealtimeListener";
import PullRefresh from "./components/PullRefresh";

export default function page() {
	return (
		<div className="w-full max-w-lg mx-auto  min-h-screen pt-10 pb-10 bg-black space-y-10">
			<PullRefresh />
			<RealtimeListener />
			<Header />
			<Activity />
			<QuestTabs />
		</div>
	);
}
