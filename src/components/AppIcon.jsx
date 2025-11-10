import React from 'react';
import { 
    TrendingUp, Calendar, Sparkles, Star, Eye, Share2, Bell, Award, Plus, ClipboardList, 
    BookOpen, BookmarkCheck, BookmarkPlus, Minus, GitCompare, Grid3X3, List, Search, Beaker, X, 
    RefreshCw, ChevronLeft, ChevronRight, HelpCircle, ArrowRight, Check, Download, LayoutDashboard, 
    User, Smile, AlertCircle, Thermometer, Image, Cloud, DollarSign, Box, Sun, Moon, Wallet, Camera, 
    ShieldCheck, Zap, CheckCircle, Activity, ChevronUp, ChevronDown, Trash2, Loader, Scan, 
    Copy, AlertTriangle, Heart, ScanSearch, IndianRupee, ThumbsUp 
} from 'lucide-react';

const AppIcon = ({ name, ...props }) => {
  const icons = {
    TrendingUp,
    Minus,
    ThumbsUp,
    IndianRupee,
    Calendar,
    Sparkles,
    Star,
    Eye,
    Image,
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
    Activity,
    ChevronUp,
    ChevronDown,
    Trash2,
    Loader,
    Scan,
    Copy,
    AlertTriangle,
    Heart,
    ScanSearch
  };

  const Icon = icons[name];

  return Icon ? <Icon {...props} /> : null;
};

export default AppIcon;
