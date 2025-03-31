
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Weight, Activity, Apple, BookOpen } from 'lucide-react';

interface CheckInFormTabsProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const CheckInFormTabs: React.FC<CheckInFormTabsProps> = ({ currentTab, onTabChange }) => {
  return (
    <TabsList className="grid grid-cols-4 mb-8">
      <TabsTrigger 
        value="measurements" 
        className="flex items-center space-x-2"
        onClick={() => onTabChange("measurements")}
        data-state={currentTab === "measurements" ? "active" : ""}
      >
        <Weight size={16} />
        <span className="hidden sm:inline">Measurements</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="wellness" 
        className="flex items-center space-x-2"
        onClick={() => onTabChange("wellness")}
        data-state={currentTab === "wellness" ? "active" : ""}
      >
        <Activity size={16} />
        <span className="hidden sm:inline">Wellness</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="nutrition" 
        className="flex items-center space-x-2"
        onClick={() => onTabChange("nutrition")}
        data-state={currentTab === "nutrition" ? "active" : ""}
      >
        <Apple size={16} />
        <span className="hidden sm:inline">Nutrition</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="supplements" 
        className="flex items-center space-x-2"
        onClick={() => onTabChange("supplements")}
        data-state={currentTab === "supplements" ? "active" : ""}
      >
        <BookOpen size={16} />
        <span className="hidden sm:inline">Supplements</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default CheckInFormTabs;
