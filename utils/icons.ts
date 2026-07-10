import {
  MagnifyingGlassIcon, SparklesIcon, ArrowRightIcon, FunnelIcon, ChartBarIcon,
  TagIcon, ArrowDownTrayIcon, DevicePhoneMobileIcon, CpuChipIcon, CodeBracketIcon,
  ServerIcon, AcademicCapIcon, BuildingLibraryIcon, HeartIcon,
  BuildingOfficeIcon, WrenchIcon, BanknotesIcon, BoltIcon, CogIcon, SunIcon,
  FireIcon, HomeIcon, ShoppingBagIcon, TruckIcon, UsersIcon, VideoCameraIcon,
  MegaphoneIcon, MapIcon, RocketLaunchIcon, Squares2X2Icon,
  CalendarIcon, CalendarDaysIcon, ArrowTrendingUpIcon, MapPinIcon, BriefcaseIcon,
} from '@heroicons/vue/24/outline'

const iconRegistry: Record<string, any> = {
  MagnifyingGlassIcon, SparklesIcon, ArrowRightIcon, FunnelIcon, ChartBarIcon,
  TagIcon, ArrowDownTrayIcon, DevicePhoneMobileIcon, CpuChipIcon, CodeBracketIcon,
  ServerIcon, AcademicCapIcon, BuildingLibraryIcon, HeartIcon,
  BuildingOfficeIcon, WrenchIcon, BanknotesIcon, BoltIcon, CogIcon, SunIcon,
  FireIcon, HomeIcon, ShoppingBagIcon, TruckIcon, UsersIcon, VideoCameraIcon,
  MegaphoneIcon, MapIcon, RocketLaunchIcon, Squares2X2Icon,
  CalendarIcon, CalendarDaysIcon, ArrowTrendingUpIcon, MapPinIcon, BriefcaseIcon,
  GraduationCapIcon: AcademicCapIcon,
  CarIcon: CogIcon,
  TrendingUpIcon: ArrowTrendingUpIcon,
}

export function resolveIcon(name: string): any {
  return iconRegistry[name] || Squares2X2Icon
}
