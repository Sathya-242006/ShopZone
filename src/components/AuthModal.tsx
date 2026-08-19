import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  ShieldCheck,
  User as UserIcon,
  ArrowRight,
  Check,
  Edit3,
  Users,
  PlusCircle,
  Sparkles,
  Phone,
  MapPin,
  Mail,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User } from '../types';

export const AuthModal: React.FC = () => {
  const {
    user,
    role,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    updateProfile,
    switchRole,
  } = useAuth();

  // Active member list from database
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Editable Customer Sign In / Quick Login state
  const [customerName, setCustomerName] = useState(user?.role === 'customer' ? user.name : 'Alex Mercer');
  const [customerEmail, setCustomerEmail] = useState(user?.role === 'customer' ? user.email : 'alex.mercer@gmail.com');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+1 (555) 876-5432');

  // Edit Active Profile state
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileStreet, setProfileStreet] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profileState, setProfileState] = useState('');
  const [profileZip, setProfileZip] = useState('');

  // Register state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerRole, setRegisterRole] = useState<'customer' | 'admin'>('customer');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerStreet, setRegisterStreet] = useState('');
  const [registerCity, setRegisterCity] = useState('');
  const [registerState, setRegisterState] = useState('');
  const [registerZip, setRegisterZip] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load known users
  useEffect(() => {
    if (isAuthModalOpen) {
      api.getUsers().then(users => {
        if (users && users.length) setAllUsers(users);
      }).catch(() => {});
      
      if (user) {
        setProfileName(user.name);
        setProfileEmail(user.email);
        setProfilePhone(user.phone || '');
        setProfileStreet(user.address?.street || '');
        setProfileCity(user.address?.city || '');
        setProfileState(user.address?.state || '');
        setProfileZip(user.address?.zipCode || '');
      }
    }
  }, [isAuthModalOpen, user]);

  if (!isAuthModalOpen) return null;

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Editable Customer Sign In
  const handleEditableCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail.trim()) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(customerEmail.trim(), customerName.trim() || undefined);
      showSuccess(`Logged in successfully as ${customerName.trim() || 'Customer'}!`);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Quick select specific user member
  const handleSelectMember = async (targetUser: User) => {
    setLoading(true);
    setError(null);
    try {
      await switchRole(targetUser.role, targetUser.id);
      showSuccess(`Switched active account to ${targetUser.name}!`);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to switch account');
    } finally {
      setLoading(false);
    }
  };

  // Admin Sathya Quick Switch
  const handleAdminSathyaLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await switchRole('admin', 'user-admin-1');
      showSuccess('Switched to Sathya (Store Admin)!');
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to switch to Admin Sathya');
    } finally {
      setLoading(false);
    }
  };

  // Save changes to current active profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await updateProfile({
        name: profileName.trim(),
        email: profileEmail.trim(),
        phone: profilePhone.trim(),
        street: profileStreet.trim(),
        city: profileCity.trim(),
        state: profileState.trim(),
        zipCode: profileZip.trim(),
      });
      showSuccess('Customer profile updated successfully!');
      setTimeout(() => setIsAuthModalOpen(false), 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Register new member
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName.trim() || !registerEmail.trim()) {
      setError('Please provide both full name and email.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register({
        name: registerName.trim(),
        email: registerEmail.trim(),
        role: registerRole,
        phone: registerPhone.trim(),
        street: registerStreet.trim(),
        city: registerCity.trim(),
        state: registerState.trim(),
        zipCode: registerZip.trim(),
      });
      showSuccess(`Welcome ${registerName.trim()}! Account created.`);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        id="auth-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">Customer & Admin Access</span>
              <span className="text-[11px] text-slate-500">Editable customer login for multiple members</span>
            </div>
          </div>
          <button
            id="auth-modal-close-btn"
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Quick Access Bar: Sathya */}
        <div className="px-6 py-3 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-xs font-bold text-indigo-200">
              <ShieldCheck className="w-4 h-4 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">Admin: Sathya</span>
                <span className="px-1.5 py-0.2 bg-indigo-500/40 border border-indigo-400/30 text-[10px] font-semibold text-indigo-200 rounded">
                  Store Owner
                </span>
              </div>
              <p className="text-[11px] text-indigo-200/80">sathya@shopzone.com • Full Store Control</p>
            </div>
          </div>

          <button
            id="quick-admin-sathya-btn"
            onClick={handleAdminSathyaLogin}
            disabled={loading}
            className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-full text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>{user?.role === 'admin' ? 'Active' : 'Sign in as Sathya'}</span>
            {user?.role === 'admin' ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 text-xs font-bold">
          <button
            id="auth-tab-login"
            onClick={() => {
              setAuthModalTab('login');
              setError(null);
            }}
            className={`flex-1 py-3 border-b-2 transition cursor-pointer flex items-center justify-center gap-1.5 ${
              authModalTab === 'login'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Customer Sign In</span>
          </button>

          <button
            id="auth-tab-profile"
            onClick={() => {
              setAuthModalTab('profile');
              setError(null);
            }}
            className={`flex-1 py-3 border-b-2 transition cursor-pointer flex items-center justify-center gap-1.5 ${
              authModalTab === 'profile'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            id="auth-tab-register"
            onClick={() => {
              setAuthModalTab('register');
              setError(null);
            }}
            className={`flex-1 py-3 border-b-2 transition cursor-pointer flex items-center justify-center gap-1.5 ${
              authModalTab === 'register'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Member</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium animate-in fade-in">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: EDITABLE CUSTOMER SIGN IN & MEMBER SWITCHER */}
          {authModalTab === 'login' && (
            <div className="space-y-5">
              {/* Preset Member Switcher */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Switch to Existing Customer Member:
                  </span>
                  <span className="text-[10px] text-indigo-600 font-medium">Click to log in</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allUsers
                    .filter(u => u.role === 'customer')
                    .map(u => {
                      const isActive = user?.id === u.id;
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            setCustomerName(u.name);
                            setCustomerEmail(u.email);
                            handleSelectMember(u);
                          }}
                          className={`p-2.5 rounded-xl text-left border transition cursor-pointer flex items-center gap-2.5 ${
                            isActive
                              ? 'bg-indigo-50/60 border-indigo-300 ring-1 ring-indigo-400'
                              : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <img
                            src={u.avatar}
                            alt={u.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-slate-900 truncate">{u.name}</p>
                              {isActive && (
                                <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-bold">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Editable Form for Custom Customer Login */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900">Custom / Editable Customer Login</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Edit name or type any member info</span>
                </div>

                <form onSubmit={handleEditableCustomerLogin} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Customer Full Name (Editable)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Sathya, Priya Sharma, John Doe..."
                        required
                        className="w-full px-3 py-2 pl-8 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
                      />
                      <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Customer Email Address (Editable)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="customer@example.com"
                        required
                        className="w-full px-3 py-2 pl-8 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 active:scale-98"
                  >
                    <span>{loading ? 'Signing in...' : `Sign In as Customer (${customerName || 'Guest'})`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: EDIT ACTIVE PROFILE */}
          {authModalTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center gap-3">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                  alt={user?.name || 'User'}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Currently Editing: <span className="text-indigo-600">{user?.name || 'Guest'}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Role: <strong className={role === 'admin' ? 'text-indigo-600' : 'text-emerald-600'}>{role === 'admin' ? 'Admin (Sathya)' : 'Customer'}</strong>
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="+1 (555) 000-0000 or +91 98765 43210"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={profileStreet}
                  onChange={(e) => setProfileStreet(e.target.value)}
                  placeholder="Flat 402, Lotus Towers, Main Street"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={profileCity}
                    onChange={(e) => setProfileCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={profileState}
                    onChange={(e) => setProfileState(e.target.value)}
                    placeholder="State"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">ZIP / PIN</label>
                  <input
                    type="text"
                    value={profileZip}
                    onChange={(e) => setProfileZip(e.target.value)}
                    placeholder="Zip Code"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
                <Check className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* TAB 3: REGISTER NEW MEMBER */}
          {authModalTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="e.g. Maria Gonzalez, David Smith..."
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="member@example.com"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegisterRole('customer')}
                    className={`py-2 text-xs rounded-xl font-semibold border cursor-pointer ${
                      registerRole === 'customer'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterRole('admin')}
                    className={`py-2 text-xs rounded-xl font-semibold border cursor-pointer ${
                      registerRole === 'admin'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Store Admin
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  placeholder="+1 (555) 019-2831"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={registerCity}
                    onChange={(e) => setRegisterCity(e.target.value)}
                    placeholder="Seattle"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">State / Zip</label>
                  <input
                    type="text"
                    value={registerState}
                    onChange={(e) => setRegisterState(e.target.value)}
                    placeholder="WA 98101"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
              >
                <span>{loading ? 'Creating member account...' : 'Create & Sign In Member'}</span>
                <Check className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>ShopZone Multi-Member Authentication</span>
          </span>
          <span className="font-semibold text-slate-700">Admin: Sathya</span>
        </div>
      </div>
    </div>
  );
};
