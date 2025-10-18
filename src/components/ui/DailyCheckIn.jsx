import React, { useState, useEffect } from 'react';
import { useUserDataContext } from '../../contexts/UserDataContext';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase';
import toast, { Toaster } from 'react-hot-toast';
import Icon from '../AppIcon';

const DailyCheckIn = () => {
    const { userData, updateUserData } = useUserDataContext();
    const auth = getAuth();
    const [isCheckedIn, setIsCheckedIn] = useState(false);

    // Reminders array remains the same
    const reminders = [
        "Drink plenty of water today!",
        "Don't forget to eat a balanced meal.",
        "A good night's sleep is key to healthy skin.",
        "Remember to apply sunscreen.",
        "Cleanse your face before bed.",
        "Moisturize daily, even if your skin feels oily.",
        "Take a deep breath and relax your jaw.",
        "Eat foods rich in vitamins and antioxidants.",
        "Wash your makeup brushes regularly.",
        "Reapply lip balm to keep your lips hydrated.",
        "Stretch your body to release tension.",
        "Use gentle products — your skin deserves kindness.",
        "Stay consistent with your skincare routine.",
        "Exfoliate once or twice a week, not every day.",
        "Change your pillowcase every few days.",
        "Limit sugar and processed foods when you can.",
        "Don’t pick at your skin — let it heal naturally.",
        "Take time today to rest and recharge.",
        "Check the ingredients before trying new products.",
        "Your skin is unique — embrace its journey."
    ];

    useEffect(() => {
        if (userData) {
            const today = new Date().toISOString().split('T')[0];
            setIsCheckedIn(userData.lastCheckIn === today);
        }
    }, [userData]);

    const handleCheckIn = async () => {
        if (!auth.currentUser || isCheckedIn) return;

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        const isConsecutive = userData.lastCheckIn === yesterday;
        const newStreak = isConsecutive ? (userData.checkInStreak || 0) + 1 : 1;

        const updatePayload = {
            lastCheckIn: today,
            checkInStreak: newStreak,
            totalCheckIns: increment(1),
            points: increment(10),
        };

        try {
            await updateUserData(updatePayload);
            toast.success("Checked in! You've earned 10 points.");
            showRandomReminder();
        } catch (error) {
            console.error("Error checking in: ", error);
            toast.error("Failed to check in. Please try again.");
        }
    };

    const showRandomReminder = () => {
        const randomReminder = reminders[Math.floor(Math.random() * reminders.length)];
        toast(randomReminder, { duration: 4000 });
    };

    // Display streak and total check-ins directly from context
    const streak = userData?.checkInStreak || 0;
    const totalCheckIns = userData?.totalCheckIns || 0;

    return (
        <div className="bg-card rounded-2xl shadow-lg p-4 text-center">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-lg font-bold text-foreground">Daily Check-in</h3>
                <button 
                    onClick={showRandomReminder} 
                    className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80 transition-colors"
                >
                    Show a Crumb
                </button>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
                Check in daily to build a healthy routine and earn points!
            </p>
            <button
                onClick={handleCheckIn}
                disabled={isCheckedIn}
                className={`w-full flex items-center justify-center py-2.5 px-4 border rounded-lg shadow-sm text-sm font-medium transition-all ${
                    isCheckedIn
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary/90'
                }`}
            >
                <Icon name={isCheckedIn ? "CheckCircle" : "PlusCircle"} size={18} className="mr-2" />
                {isCheckedIn ? "Checked in for today!" : "Check In Now"}
            </button>
            <div className="mt-3 text-xs text-muted-foreground">
                <p>
                    Current Streak: <span className="font-bold text-primary">{streak}</span> days
                    <span className="mx-2">|</span>
                    Total Check-ins: <span className="font-bold">{totalCheckIns}</span> days
                </p>
            </div>
        </div>
    );
};

export default DailyCheckIn;
