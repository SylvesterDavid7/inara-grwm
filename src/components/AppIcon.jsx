import React from 'react';
import { TrendingUp, Calendar, Sparkles, Star, Eye, Share2, Bell, Award, Plus, ClipboardList, BookOpen, BookmarkCheck, BookmarkPlus, GitCompare, Grid3X3, List, Search, Beaker, X, RefreshCw, ChevronLeft, ChevronRight, HelpCircle, ArrowRight, Check, Download, LayoutDashboard, User, Smile, AlertCircle, Thermometer, Cloud, DollarSign, Box, Sun, Moon, Wallet, Camera, ShieldCheck, Zap, CheckCircle, Activity } from 'lucide-react';

const AppIcon = ({ name, ...props }) => {
  const icons = {
    TrendingUp,
    Calendar,
    Sparkles,
    Star,
    Eye,
    Share2,
    Bell,
    Award,
    Plus,
    ClipboardList,
    BookOpen,
    BookmarkCheck,
    BookmarkPlus,
    GitCompare,
    Grid3X3,
    List,
    Search,
    Beaker,
    X,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    HelpCircle,
    ArrowRight,
    Check,
    Download,
    LayoutDashboard,
    User,
    Smile,
    AlertCircle,
    Thermometer,
    Cloud,
    DollarSign,
    Box,
    Sun,
    Moon,
    Wallet,
    Camera,
    ShieldCheck,
    Zap,
    CheckCircle,
    Activity
  };

  const Icon = icons[name];

  return Icon ? <Icon {...props} /> : null;
};

export default AppIcon;
