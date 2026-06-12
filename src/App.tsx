import React, { useState, useEffect, useRef } from 'react';
import { 
  Wallet, Upload, Shield, Globe, Trash2, Download, 
  ExternalLink, Copy, Check, Search, File as FileIcon, 
  FileImage, FileText, FileVideo, FileAudio, FolderArchive, 
  X, Info, HardDrive, ShieldCheck, AlertCircle, Play, Eye
} from 'lucide-react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { ShelbyService, type WalletState } from './services/shelby';
import type { UploadedFile } from './services/db';

function App() {
  const { 
    connected: aptosConnected, 
    account: aptosAccount, 
    wallet: aptosWallet,
    wallets,
    connect: aptosConnect, 
    disconnect: aptosDisconnect,
    signMessage: aptosSignMessage,
    signAndSubmitTransaction: aptosSignAndSubmitTransaction
  } = useWallet();

  // Wallet state
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: '',
    walletType: null,
    network: 'simulated',
    balanceAPT: 0,
    balanceSHELBYUSD: 0,
    isMock: false,
  });

  // Helper to get official wallet logos
  const getWalletIcon = (walletType: 'petra' | 'metamask' | 'okx') => {
    if (walletType === 'metamask') {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 318.6 360">
        <style>
          .st1,.st6{fill:#e4761b;stroke:#e4761b;stroke-linecap:round;stroke-linejoin:round}.st6{fill:#f6851b;stroke:#f6851b}
        </style>
        <g transform="translate(0, 5)">
          <path fill="#e2761b" stroke="#e2761b" stroke-linecap="round" stroke-linejoin="round" d="m274.1 35.5-99.5 73.9L193 65.8z"/>
          <path d="m44.4 35.5 98.7 74.6-17.5-44.3zm193.9 171.3-26.5 40.6 56.7 15.6 16.3-55.3zm-204.4.9L50.1 263l56.7-15.6-26.5-40.6z" class="st1"/>
          <path d="m103.6 138.2-15.8 23.9 56.3 2.5-2-60.5zm111.3 0-39-34.8-1.3 61.2 56.2-2.5zM106.8 247.4l33.8-16.5-29.2-22.8zm71.1-16.5 33.9 16.5-4.7-39.3z" class="st1"/>
          <path fill="#d7c1b3" stroke="#d7c1b3" stroke-linecap="round" stroke-linejoin="round" d="m211.8 247.4-33.9-16.5 2.7 22.1-.3 9.3zm-105 0 31.5 14.9-.2-9.3 2.5-22.1z"/>
          <path fill="#233447" stroke="#233447" stroke-linecap="round" stroke-linejoin="round" d="m138.8 193.5-28.2-8.3 19.9-9.1zm40.9 0 8.3-17.4 20 9.1z"/>
          <path fill="#cd6116" stroke="#cd6116" stroke-linecap="round" stroke-linejoin="round" d="m106.8 247.4 4.8-40.6-31.3.9zM207 206.8l4.8 40.6 26.5-39.7zm23.8-44.7-56.2 2.5 5.2 28.9 8.3-17.4 20 9.1zm-120.2 23.1 20-9.1 8.2 17.4 5.3-28.9-56.3-2.5z"/>
          <path fill="#e4751f" stroke="#e4751f" stroke-linecap="round" stroke-linejoin="round" d="m87.8 162.1 23.6 46-.8-22.9zm120.3 23.1-1 22.9 23.7-46zm-64-20.6-5.3 28.9 6.6 34.1 1.5-44.9zm30.5 0-2.7 18 1.2 45 6.7-34.1z"/>
          <path d="m179.8 193.5-6.7 34.1 4.8 3.3 29.2-22.8 1-22.9zm-69.2-8.3.8 22.9 29.2 22.8 4.8-3.3-6.6-34.1z" class="st6"/>
          <path fill="#c0ad9e" stroke="#c0ad9e" stroke-linecap="round" stroke-linejoin="round" d="m180.3 262.3.3-9.3-2.5-2.2h-37.7l-2.3 2.2.2 9.3-31.5-14.9 11 9 22.3 15.5h38.3l22.4-15.5 11-9z"/>
          <path fill="#161616" stroke="#161616" stroke-linecap="round" stroke-linejoin="round" d="m177.9 230.9-4.8-3.3h-27.7l-4.8 3.3-2.5 22.1 2.3-2.2h37.7l2.5 2.2z"/>
          <path fill="#763d16" stroke="#763d16" stroke-linecap="round" stroke-linejoin="round" d="m278.3 114.2 8.5-40.8-12.7-37.9-96.2 71.4 37 31.3 52.3 15.3 11.6-13.5-5-3.6 8-7.3-6.2-4.8 8-6.1zM31.8 73.4l8.5 40.8-5.4 4 8 6.1-6.1 4.8 8 7.3-5 3.6 11.5 13.5 52.3-15.3 37-31.3-96.2-71.4z"/>
          <path d="m267.2 153.5-52.3-15.3 15.9 23.9-23.7 46 31.2-.4h46.5zm-163.6-15.3-52.3 15.3-17.4 54.2h46.4l31.1.4-23.6-46zm71 26.4 3.3-57.7 15.2-41.1h-67.5l15 41.1 3.5 57.7 1.2 18.2.1 44.8h27.7l.2-44.8z" class="st6"/>
        </g>
        <text x="159.3" y="338" font-family="'Inter', system-ui, -apple-system, sans-serif" font-weight="800" font-size="24" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">METAMASK</text>
      </svg>`;
      return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }
    
    if (walletType === 'okx') {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 826 298">
        <rect width="826" height="298" rx="60" fill="#000000"/>
        <g fill="#FFFFFF">
          <!-- O -->
          <path d="M50 50h198v198H50V50zm66 66v66h66v-66h-66z" fill-rule="evenodd"/>
          <!-- K -->
          <rect x="314" y="50" width="66" height="198"/>
          <rect x="446" y="50" width="66" height="66"/>
          <rect x="446" y="182" width="66" height="66"/>
          <!-- X -->
          <rect x="578" y="50" width="66" height="66"/>
          <rect x="644" y="116" width="66" height="66"/>
          <rect x="710" y="50" width="66" height="66"/>
          <rect x="578" y="182" width="66" height="66"/>
          <rect x="710" y="182" width="66" height="66"/>
        </g>
      </svg>`;
      return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }
    
    const foundWallet = wallets.find((w: any) => (w as any).name.toLowerCase().includes(walletType));
    if (foundWallet && (foundWallet as any).icon) {
      return (foundWallet as any).icon;
    }
    
    // Fallback if the wallets adapter array has not loaded yet
    if (walletType === 'petra') {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <rect width="120" height="120" rx="28" fill="#1A1D26"/>
        <path d="M60 20 L95 40 L95 80 L60 100 L25 80 L25 40 Z" fill="#00D292"/>
        <path d="M60 20 L60 100 L25 80 L25 40 Z" fill="#00A875"/>
        <path d="M60 35 L80 50 L80 70 L60 85 L40 70 L40 50 Z" fill="#FFFFFF" opacity="0.85"/>
        <path d="M60 35 L60 85 L40 70 L40 50 Z" fill="#DDFDF5" opacity="0.85"/>
      </svg>`;
      return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }
    
    return '';
  };

  // Sync adapter state to wallet state
  useEffect(() => {
    if (aptosConnected && aptosAccount) {
      const rawAddress = aptosAccount.address.toString();
      
      // Normalize Aptos address (pad with leading zeros to 64 hex characters)
      let hex = rawAddress.startsWith('0x') ? rawAddress.substring(2) : rawAddress;
      while (hex.length < 64) {
        hex = '0' + hex;
      }
      const address = '0x' + hex;
      
      const walletName = aptosWallet?.name || 'wallet';
      const walletType = (walletName.toLowerCase().includes('petra') ? 'petra' : 'okx') as any;

      // Fetch actual on-chain balance dynamically from Aptos node
      const fetchBalance = async () => {
        let actualBalance = 0.0;
        let activeNetwork = 'shelbynet';
        
        for (const net of ['devnet', 'testnet', 'mainnet']) {
          try {
            const res = await fetch(`https://api.${net}.aptoslabs.com/v1/accounts/${address}/resources`);
            if (res.ok) {
              const resources = await res.json();
              const store = resources.find((r: any) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>");
              if (store && store.data && store.data.coin) {
                actualBalance = parseInt(store.data.coin.value) / 100000000;
                
                if (net === 'mainnet') activeNetwork = 'Aptos Mainnet';
                else if (net === 'testnet') activeNetwork = 'Aptos Testnet';
                else activeNetwork = 'Aptos Devnet';
                break;
              }
            }
          } catch (e) {
            console.error(`Error querying Aptos balance on ${net}:`, e);
          }
        }

        setWallet(prev => ({
          ...prev,
          connected: true,
          address,
          walletType,
          network: activeNetwork as any,
          balanceAPT: actualBalance,
          balanceSHELBYUSD: actualBalance * 15.4, // Live conversion estimation
          isMock: false,
        }));
      };

      fetchBalance();
      showToast(`Connected to ${walletName} successfully!`, 'success');
    } else if (!aptosConnected && wallet.connected && !wallet.isMock) {
      setWallet({
        connected: false,
        address: '',
        walletType: null,
        network: 'simulated',
        balanceAPT: 0,
        balanceSHELBYUSD: 0,
        isMock: false,
      });
    }
  }, [aptosConnected, aptosAccount, aptosWallet]);

  // Fallback state for wallets that fail to connect (e.g. extension not found)
  const [connectionErrorWallet, setConnectionErrorWallet] = useState<'petra' | 'metamask' | 'okx' | null>(null);
  
  // Mobile browser detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Modal states
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedShareFile, setSelectedShareFile] = useState<UploadedFile | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // File Preview Modal state
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
  const [previewTextContent, setPreviewTextContent] = useState<string>('');

  // File list & search
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'image' | 'document' | 'video' | 'archive' | 'other'>('all');

  // Uploading state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  // Error/Success Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Show notification utility
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Load files when wallet changes
  useEffect(() => {
    if (wallet.connected) {
      loadFiles();
    } else {
      setFiles([]);
    }
  }, [wallet.connected, wallet.address]);

  const loadFiles = async () => {
    try {
      const userFiles = await ShelbyService.getFiles(wallet.address);
      setFiles(userFiles);
    } catch (err) {
      console.error('Failed to load files:', err);
      showToast('Could not load uploaded files list.', 'error');
    }
  };

  // Connect Wallet handler
  const handleConnect = async (walletType: 'petra' | 'metamask' | 'okx', useMock: boolean) => {
    if (useMock) {
      try {
        const state = await ShelbyService.connect(walletType, true);
        setWallet(state);
        setIsWalletModalOpen(false);
        setConnectionErrorWallet(null);
        showToast(`Connected to ${walletType.toUpperCase()} wallet (Demo Mode) successfully!`, 'success');
      } catch (err: any) {
        showToast(err.message || 'Demo connection failed.', 'error');
      }
      return;
    }

    try {
      if (walletType === 'petra') {
        const petra = wallets.find((w: any) => (w as any).name.toLowerCase().includes('petra') || (w as any).name === 'Petra');
        if (petra) {
          await aptosConnect((petra as any).name);
          setIsWalletModalOpen(false);
          setConnectionErrorWallet(null);
        } else {
          throw new Error('Petra Wallet not found. Please install the Petra browser extension.');
        }
      } else if (walletType === 'okx') {
        const okx = wallets.find((w: any) => (w as any).name.toLowerCase().includes('okx') || (w as any).name === 'OKX Wallet');
        if (okx) {
          await aptosConnect((okx as any).name);
          setIsWalletModalOpen(false);
          setConnectionErrorWallet(null);
        } else {
          throw new Error('OKX Wallet not found. Please install the OKX browser extension.');
        }
      } else if (walletType === 'metamask') {
        const state = await ShelbyService.connect('metamask', false);
        setWallet(state);
        setIsWalletModalOpen(false);
        setConnectionErrorWallet(null);
        showToast('Connected to MetaMask successfully!', 'success');
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = (err.message || '').toLowerCase();
      if (
        errMsg.includes('not found') || 
        errMsg.includes('install') || 
        errMsg.includes('extension') || 
        errMsg.includes('no accounts') ||
        isMobile
      ) {
        setConnectionErrorWallet(walletType);
      } else {
        showToast(err.message || 'Wallet connection failed.', 'error');
      }
    }
  };

  // Disconnect Wallet
  const handleDisconnect = async () => {
    if (aptosConnected) {
      try {
        await aptosDisconnect();
      } catch (e) {
        console.error('Disconnect failed', e);
      }
    }
    setWallet({
      connected: false,
      address: '',
      walletType: null,
      network: 'simulated',
      balanceAPT: 0,
      balanceSHELBYUSD: 0,
      isMock: false,
    });
    showToast('Wallet disconnected.', 'info');
  };

  // File Upload handler
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;
    await processFileUpload(fileList[0]);
  };

  const processFileUpload = async (file: File) => {
    if (!wallet.connected) {
      setIsWalletModalOpen(true);
      showToast('Please connect your wallet before uploading files.', 'info');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadStatus('Preparing file...');

      const fileRecord = await ShelbyService.uploadFile(
        file,
        isPrivate,
        wallet,
        (progress) => {
          setUploadProgress(progress);
          if (progress < 30) {
            setUploadStatus('Reading file into memory...');
          } else if (progress < 65) {
            setUploadStatus(isPrivate ? 'Generating AES key and encrypting locally...' : 'Uploading chunks to storage network...');
          } else if (progress < 90) {
            setUploadStatus('Registering cryptographic commitment on Shelbynet...');
          } else {
            setUploadStatus('Storage completed!');
          }
        },
        aptosSignMessage,
        aptosSignAndSubmitTransaction
      );

      if (fileRecord.txHash) {
        showToast(`File "${file.name}" uploaded successfully! Transaction registered on-chain.`, 'success');
      } else {
        showToast(`File "${file.name}" uploaded successfully!`, 'success');
      }
      loadFiles();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'File upload failed.', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStatus('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFileUpload(e.dataTransfer.files[0]);
    }
  };

  // File Download / Decryption
  const handleDownload = async (file: UploadedFile) => {
    try {
      showToast(file.isPrivate ? 'Verifying wallet signature and decrypting locally...' : 'Downloading file...', 'info');
      const { name, url } = await ShelbyService.downloadFile(file, wallet, aptosSignMessage);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('File downloaded successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'File download/decryption failed.', 'error');
    }
  };

  // File Preview Handler
  const handlePreviewFile = async (file: UploadedFile) => {
    try {
      setIsPreviewLoading(true);
      setPreviewFile(file);
      setPreviewTextContent('');
      showToast(file.isPrivate ? 'Verifying wallet signature and decrypting locally...' : 'Loading file preview...', 'info');
      
      const { url } = await ShelbyService.downloadFile(file, wallet, aptosSignMessage);
      setPreviewUrl(url);

      // If it's a text/code file, fetch the content to display it nicely
      const t = file.type.toLowerCase();
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const isText = t.startsWith('text/') || ['json', 'js', 'ts', 'jsx', 'tsx', 'css', 'html', 'md', 'txt'].includes(ext);
      if (isText) {
        try {
          const res = await fetch(url);
          const text = await res.text();
          // limit text content to prevent UI lag on huge files
          setPreviewTextContent(text.slice(0, 100000));
        } catch (err) {
          console.error('Failed to fetch text content for preview', err);
        }
      }
      
      showToast('Preview loaded successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to load file preview.', 'error');
      setPreviewFile(null);
      setPreviewUrl('');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleClosePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewFile(null);
    setPreviewUrl('');
    setPreviewTextContent('');
  };

  // File Delete
  const handleDelete = async (fileId: string, name: string) => {
    if (confirm(`Are you sure you want to delete file "${name}" from Shelby storage?`)) {
      try {
        await ShelbyService.deleteFile(fileId);
        showToast('File deleted successfully.', 'success');
        loadFiles();
      } catch (err) {
        console.error(err);
        showToast('Could not delete file.', 'error');
      }
    }
  };

  // Share link handler
  const handleOpenShare = (file: UploadedFile) => {
    setSelectedShareFile(file);
    setIsShareModalOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    showToast('Public link copied to clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Helper formats
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get file icon based on mime type / name extension
  const getFileIconComponent = (type: string, name: string) => {
    const t = type.toLowerCase();
    const ext = name.split('.').pop()?.toLowerCase() || '';

    if (t.startsWith('image/')) return <FileImage style={{ color: 'var(--accent-cyan)' }} size={24} />;
    if (t.startsWith('video/')) return <FileVideo style={{ color: 'var(--accent-purple)' }} size={24} />;
    if (t.startsWith('audio/')) return <FileAudio style={{ color: 'var(--accent-cyan)' }} size={24} />;
    if (ext === 'pdf' || t.includes('pdf')) return <FileText style={{ color: 'var(--accent-rose)' }} size={24} />;
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) || t.includes('zip') || t.includes('compressed')) {
      return <FolderArchive style={{ color: 'gold' }} size={24} />;
    }
    return <FileIcon style={{ color: 'var(--text-secondary)' }} size={24} />;
  };

  // Filter files
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    const t = file.type.toLowerCase();
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (selectedCategory === 'image') return matchesSearch && t.startsWith('image/');
    if (selectedCategory === 'video') return matchesSearch && (t.startsWith('video/') || t.startsWith('audio/'));
    if (selectedCategory === 'document') return matchesSearch && (ext === 'pdf' || t.includes('pdf') || t.includes('text') || t.includes('document') || ext === 'docx' || ext === 'xlsx' || ext === 'pptx');
    if (selectedCategory === 'archive') return matchesSearch && (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) || t.includes('compressed') || t.includes('zip'));
    if (selectedCategory === 'other') {
      const isKnown = t.startsWith('image/') || t.startsWith('video/') || t.startsWith('audio/') || ext === 'pdf' || t.includes('pdf') || t.includes('text') || ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) || t.includes('zip');
      return matchesSearch && !isKnown;
    }
    return matchesSearch;
  });

  // Calculate statistics
  const totalStorage = files.reduce((acc, file) => acc + file.size, 0);
  const privateCount = files.filter(f => f.isPrivate).length;
  const publicCount = files.filter(f => !f.isPrivate).length;

  // Helper to get native wallet app deep link
  const getWalletDeepLink = (walletType: 'petra' | 'metamask' | 'okx') => {
    const currentUrl = window.location.href;
    if (walletType === 'metamask') {
      const cleanHost = window.location.host;
      const cleanPath = window.location.pathname;
      const cleanHash = window.location.hash;
      return `https://metamask.app.link/dapp/${cleanHost}${cleanPath}${cleanHash}`;
    }
    if (walletType === 'okx') {
      return `https://www.okx.com/download?deeplink=${encodeURIComponent('okx://wallet/dapp/details?dappUrl=' + encodeURIComponent(currentUrl))}`;
    }
    if (walletType === 'petra') {
      return `https://petra.app/download?link=${encodeURIComponent(currentUrl)}`;
    }
    return '#';
  };

  // Helper to get friendly wallet name
  const getWalletName = (walletType: 'petra' | 'metamask' | 'okx') => {
    if (walletType === 'petra') return 'Petra Wallet';
    if (walletType === 'metamask') return 'MetaMask';
    if (walletType === 'okx') return 'OKX Wallet';
    return '';
  };

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 2000,
          padding: '12px 24px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: notification.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : notification.type === 'error' ? 'rgba(244, 63, 94, 0.95)' : 'rgba(30, 41, 59, 0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: 'var(--shadow-lg)',
          backdropFilter: 'blur(8px)',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          color: '#fff',
          fontWeight: 600,
          fontSize: '14px'
        }}>
          {notification.type === 'success' && <ShieldCheck size={20} />}
          {notification.type === 'error' && <AlertCircle size={20} />}
          {notification.type === 'info' && <Info size={20} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(255, 91, 176, 0.3)'
          }}>
            <img 
              src="/favicon.svg" 
              alt="Shelby Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <span className="logo-text">Shelby Upload</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {wallet.connected && (
            <div className="badge badge-network" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: wallet.network === 'shelbynet' ? 'var(--accent-emerald)' : 'gold',
                display: 'inline-block'
              }}></span>
              {wallet.network === 'shelbynet' ? 'Shelbynet Testnet' : 'Simulated Node'}
            </div>
          )}
          
          {wallet.connected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                textAlign: 'right',
                display: 'none',
                flexDirection: 'column',
              }} className="md-flex-only">
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  {wallet.balanceAPT.toFixed(4)} APT ({wallet.network})
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {wallet.balanceSHELBYUSD.toFixed(2)} ShelbyUSD (Shelbynet)
                </span>
              </div>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={handleDisconnect}
                style={{ fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {wallet.walletType && (
                  <img 
                    src={getWalletIcon(wallet.walletType)} 
                    alt={wallet.walletType} 
                    style={{ width: '16px', height: '16px', borderRadius: '4px', objectFit: 'contain' }} 
                  />
                )}
                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={() => setIsWalletModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Wallet size={16} />
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      {/* Main Grid Layout */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Intro Banner for non-connected users */}
        {!wallet.connected && (
          <div className="glass glow-card" style={{ padding: '48px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <h1 style={{ fontSize: '36px', maxWidth: '800px', margin: '0 auto', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              High-Security Decentralized Storage via Shelby Protocol
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', fontSize: '16px' }}>
              Next-generation Web3 cloud storage. Encrypt your files locally using your wallet signature and generate instant public sharing links.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => setIsWalletModalOpen(true)}
              style={{ padding: '14px 28px', fontSize: '16px', marginTop: '12px' }}
            >
              Connect Wallet to Start
            </button>
          </div>
        )}

        {/* Dashboard Panels (Connected State) */}
        {wallet.connected && (
          <>
            {/* Stats Summary cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px'
            }}>
              <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HardDrive size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Storage</div>
                  <div style={{ fontSize: '20px', fontWeight: 700 }}>{formatBytes(totalStorage)}</div>
                </div>
              </div>
              
              <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Private Files</div>
                  <div style={{ fontSize: '20px', fontWeight: 700 }}>{privateCount} files</div>
                </div>
              </div>

              <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Public Files</div>
                  <div style={{ fontSize: '20px', fontWeight: 700 }}>{publicCount} files</div>
                </div>
              </div>

            </div>

            {/* Upload Area & Mode selection */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '24px'
            }}>
              <div className="glass" style={{ padding: '32px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Upload size={20} style={{ color: 'var(--accent-purple)' }} />
                  Upload New File
                </h2>

                {/* Privacy toggle option */}
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '24px', 
                  marginBottom: '24px',
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div 
                    onClick={() => setIsPrivate(true)}
                    style={{
                      flex: '1 1 200px',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: isPrivate ? 'var(--accent-rose)' : 'transparent',
                      background: isPrivate ? 'rgba(244, 63, 94, 0.05)' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Shield size={20} style={{ color: 'var(--accent-rose)', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: isPrivate ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        Private File (Encrypted)
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Files are encrypted locally with AES-GCM before upload. Decryptable only by your wallet.
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => setIsPrivate(false)}
                    style={{
                      flex: '1 1 200px',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: !isPrivate ? 'var(--accent-cyan)' : 'transparent',
                      background: !isPrivate ? 'rgba(6, 182, 212, 0.05)' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Globe size={20} style={{ color: 'var(--accent-cyan)', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: !isPrivate ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        Public File (Unencrypted)
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Files are unencrypted and accessible by anyone via a public shareable link.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload drag drop zone */}
                {isUploading ? (
                  <div style={{
                    border: '2px dashed var(--border-hover)',
                    borderRadius: '16px',
                    padding: '40px 24px',
                    textAlign: 'center',
                    background: 'rgba(139, 92, 246, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <div className="spinner" style={{ width: '36px', height: '36px', borderWidth: '3px', color: 'var(--accent-purple)' }}></div>
                    <div style={{ fontWeight: 600 }}>{uploadStatus}</div>
                    
                    <div style={{ width: '100%', maxWidth: '400px' }}>
                      <div className="progress-container">
                        <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                        {uploadProgress}%
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleUpload}
                      style={{ display: 'none' }}
                    />
                    <div className="upload-icon-wrapper">
                      <Upload size={32} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '15px' }}>
                        Drag & drop a file here, or click to browse
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Supports all formats: Images, PDFs, Videos, ZIPs, Documents up to 100MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Storage Explorer Section */}
            <div className="glass" style={{ padding: '32px' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '20px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HardDrive size={20} style={{ color: 'var(--accent-cyan)' }} />
                    Your Uploaded Files
                  </h2>

                  {/* Search Input */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '320px',
                  }}>
                    <Search size={16} style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)'
                    }} />
                    <input 
                      type="text"
                      placeholder="Search files..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 16px 10px 36px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--accent-purple)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    />
                  </div>
                </div>

                {/* Filter categories */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}>
                  {[
                    { id: 'all', label: 'All Files' },
                    { id: 'image', label: 'Images' },
                    { id: 'document', label: 'Documents & PDFs' },
                    { id: 'video', label: 'Media' },
                    { id: 'archive', label: 'Archives & ZIPs' },
                    { id: 'other', label: 'Others' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id as any)}
                      className={`btn btn-sm ${selectedCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Files */}
              {filteredFiles.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  color: 'var(--text-secondary)'
                }}>
                  <FileIcon size={48} style={{ strokeWidth: 1, color: 'var(--text-muted)', marginBottom: '12px' }} />
                  <p style={{ fontWeight: 600 }}>No files found</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {searchQuery ? 'Try changing your search query.' : 'Drag & drop or select a file to start uploading!'}
                  </p>
                </div>
              ) : (
                <div className="file-grid">
                  {filteredFiles.map(file => (
                    <div className="glass file-card glow-card" key={file.id}>
                      <div className="file-info">
                        <div className="file-icon-box">
                          {getFileIconComponent(file.type, file.name)}
                        </div>
                        <div className="file-meta">
                          <div className="file-name" title={file.name}>{file.name}</div>
                          <div className="file-details">
                            <span>Size: {formatBytes(file.size)}</span>
                            <span>Uploaded: {formatDate(file.uploadedAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                        {file.isPrivate ? (
                          <span className="badge badge-private" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Shield size={12} />
                            Private
                          </span>
                        ) : (
                          <span className="badge badge-public" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Globe size={12} />
                            Public
                          </span>
                        )}

                        {file.txHash && (
                          <a 
                            href={`https://explorer.aptoslabs.com/txn/${file.txHash}?network=${wallet.network.toLowerCase().includes('mainnet') ? 'mainnet' : 'testnet'}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="badge"
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '4px',
                              backgroundColor: 'rgba(59, 130, 246, 0.15)',
                              color: 'var(--accent-cyan)',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              textDecoration: 'none',
                              fontSize: '11px',
                              cursor: 'pointer',
                              fontFamily: 'var(--font-sans)'
                            }}
                            title="View transaction on Aptos Explorer"
                          >
                            <ExternalLink size={10} />
                            Aptos Tx
                          </a>
                        )}
                      </div>

                      <div className="file-actions">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handlePreviewFile(file)}
                          style={{
                            flex: 1,
                            marginRight: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            background: 'var(--gradient-primary)',
                            border: 'none',
                            color: '#fff',
                            fontWeight: 600
                          }}
                        >
                          {file.type.toLowerCase().startsWith('video/') || file.type.toLowerCase().startsWith('audio/') ? (
                            <>
                              <Play size={14} fill="currentColor" />
                              Play
                            </>
                          ) : (
                            <>
                              <Eye size={14} />
                              View
                            </>
                          )}
                        </button>

                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleDownload(file)}
                          style={{
                            marginRight: '8px',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Download file"
                        >
                          <Download size={14} />
                        </button>

                        {!file.isPrivate && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenShare(file)}
                            style={{
                              marginRight: '8px',
                              padding: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Share public link"
                          >
                            <ExternalLink size={14} style={{ color: 'var(--accent-cyan)' }} />
                          </button>
                        )}

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(file.id, file.name)}
                          style={{
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Delete file"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Wallet Connection Modal */}
      {isWalletModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsWalletModalOpen(false); setConnectionErrorWallet(null); }}>
          <div className="glass modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wallet size={20} style={{ color: 'var(--accent-purple)' }} />
                {connectionErrorWallet ? 'Connection Fallback' : 'Connect Your Wallet'}
              </h3>
              <button 
                onClick={() => { setIsWalletModalOpen(false); setConnectionErrorWallet(null); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {connectionErrorWallet ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(244, 63, 94, 0.1)',
                  color: 'var(--accent-rose)',
                  margin: '0 auto'
                }}>
                  <AlertCircle size={36} />
                </div>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {getWalletName(connectionErrorWallet)} Not Detected
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.6' }}>
                    {isMobile 
                      ? `To connect your real wallet on mobile, you can open this site in the ${getWalletName(connectionErrorWallet)} app's built-in DApp browser, or use Demo Mode for instant simulated access.` 
                      : `The wallet extension is not installed or detected in your browser. Install the extension or connect via Demo Mode for simulated testing.`
                    }
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  <a 
                    href={getWalletDeepLink(connectionErrorWallet)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px'
                    }}
                  >
                    <ExternalLink size={16} />
                    {isMobile ? `Open in ${getWalletName(connectionErrorWallet)} App` : `Get ${getWalletName(connectionErrorWallet)}`}
                  </a>

                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleConnect(connectionErrorWallet, true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px',
                      borderColor: 'var(--accent-purple)',
                      background: 'rgba(139, 92, 246, 0.05)'
                    }}
                  >
                    <ShieldCheck size={16} style={{ color: 'var(--accent-purple)' }} />
                    Use Demo Mode (Simulated Wallet)
                  </button>

                  <button 
                    className="btn btn-secondary"
                    onClick={() => setConnectionErrorWallet(null)}
                    style={{ padding: '12px', marginTop: '4px' }}
                  >
                    Back to Wallet List
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '-8px' }}>
                  Shelby Upload connects to your wallet to securely sign storage transactions and decrypt private files.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {isMobile && (
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(6, 182, 212, 0.08)',
                      border: '1px solid rgba(6, 182, 212, 0.2)',
                      fontSize: '12px',
                      color: 'var(--accent-cyan)',
                      lineHeight: '1.5',
                      marginBottom: '4px'
                    }}>
                      <strong>Tip:</strong> Tap a wallet option to launch its mobile app browser, or choose <strong>Demo Mode</strong> below for instant simulated access without downloading any app.
                    </div>
                  )}

                  {/* Petra Wallet */}
                  <div className="wallet-option" onClick={() => handleConnect('petra', false)}>
                    <div className="wallet-option-details">
                      <img 
                        src={getWalletIcon('petra')} 
                        alt="Petra" 
                        style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'contain', background: '#0e1017', padding: '4px', border: '1px solid var(--border-color)' }} 
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>Petra Wallet</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Connect to official Petra Aptos wallet</div>
                      </div>
                    </div>
                  </div>

                  {/* MetaMask Wallet */}
                  <div className="wallet-option" onClick={() => handleConnect('metamask', false)}>
                    <div className="wallet-option-details">
                      <img 
                        src={getWalletIcon('metamask')} 
                        alt="MetaMask" 
                        style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'contain', background: '#0e1017', padding: '2px', border: '1px solid var(--border-color)' }} 
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>MetaMask</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Connect via DAA (EVM)</div>
                      </div>
                    </div>
                  </div>

                  {/* OKX Wallet */}
                  <div className="wallet-option" onClick={() => handleConnect('okx', false)}>
                    <div className="wallet-option-details">
                      <img 
                        src={getWalletIcon('okx')} 
                        alt="OKX" 
                        style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'contain', background: '#000', padding: '4px', border: '1px solid var(--border-color)' }} 
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>OKX Wallet</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Connect to multi-chain OKX wallet</div>
                      </div>
                    </div>
                  </div>

                  {/* Demo Mode / Simulated Wallet */}
                  <div 
                    className="wallet-option" 
                    onClick={() => handleConnect('petra', true)}
                    style={{ 
                      borderColor: 'var(--accent-purple)',
                      background: 'rgba(139, 92, 246, 0.05)',
                      boxShadow: '0 0 10px rgba(139, 92, 246, 0.15)'
                    }}
                  >
                    <div className="wallet-option-details">
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '8px', 
                        background: 'rgba(139, 92, 246, 0.15)', 
                        color: 'var(--accent-purple)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        border: '1px solid rgba(139, 92, 246, 0.3)'
                      }}>
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>Demo Mode (Simulated Wallet)</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Instant access without extensions or app downloads</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Share public link Modal */}
      {isShareModalOpen && selectedShareFile && (
        <div className="modal-overlay" onClick={() => setIsShareModalOpen(false)}>
          <div className="glass modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={20} style={{ color: 'var(--accent-cyan)' }} />
                Public Share Link
              </h3>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '-8px' }}>
              Anyone with this link can download and view your decentralized file directly from the Shelby gateway.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>File Name:</div>
              <div style={{
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {selectedShareFile.name}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Public Shareable Link:</div>
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                <input 
                  type="text"
                  readOnly
                  value={selectedShareFile.shareableUrl || ''}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-input)',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    outline: 'none',
                    textOverflow: 'ellipsis'
                  }}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => copyToClipboard(selectedShareFile.shareableUrl || '')}
                  style={{
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexShrink: 0
                  }}
                >
                  {isCopied ? <Check size={16} /> : <Copy size={16} />}
                  {isCopied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <a 
                href={selectedShareFile.shareableUrl || ''}
                target="_blank" 
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                Open Link
                <ExternalLink size={14} />
              </a>
              
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setIsShareModalOpen(false)}
                style={{ flex: 1 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <div className="modal-overlay" onClick={handleClosePreview}>
          <div className="glass modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {getFileIconComponent(previewFile.type, previewFile.name)}
                <span title={previewFile.name} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{previewFile.name}</span>
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                {previewFile.isPrivate ? (
                  <span className="badge badge-private" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Shield size={12} />
                    Private
                  </span>
                ) : (
                  <span className="badge badge-public" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Globe size={12} />
                    Public
                  </span>
                )}
                <button 
                  onClick={handleClosePreview}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px'
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '200px',
              width: '100%',
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid var(--border-color)',
              marginBottom: '16px'
            }}>
              {isPreviewLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div className="spinner" style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '3px solid rgba(255, 91, 176, 0.2)',
                    borderTopColor: 'var(--accent-purple)',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>
                    {previewFile.isPrivate ? 'Verifying signature and decrypting locally...' : 'Streaming from decentralized storage...'}
                  </div>
                </div>
              ) : previewUrl ? (
                (() => {
                  const t = previewFile.type.toLowerCase();
                  const ext = previewFile.name.split('.').pop()?.toLowerCase() || '';

                  if (t.startsWith('image/')) {
                    return (
                      <img 
                        src={previewUrl} 
                        alt={previewFile.name} 
                        style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: '8px', objectFit: 'contain' }} 
                      />
                    );
                  }

                  if (t.startsWith('video/')) {
                    return (
                      <video 
                        src={previewUrl} 
                        controls 
                        autoPlay 
                        style={{ width: '100%', maxHeight: '60vh', borderRadius: '8px', backgroundColor: '#000' }} 
                      />
                    );
                  }

                  if (t.startsWith('audio/')) {
                    return (
                      <div style={{ width: '100%', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <div style={{ 
                          width: '80px', 
                          height: '80px', 
                          borderRadius: '50%', 
                          background: 'var(--gradient-primary)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: '#fff',
                          boxShadow: '0 0 20px rgba(255, 91, 176, 0.4)'
                        }}>
                          <FileAudio size={40} />
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '15px', textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {previewFile.name}
                        </div>
                        <audio 
                          src={previewUrl} 
                          controls 
                          autoPlay 
                          style={{ width: '100%', maxWidth: '500px' }} 
                        />
                      </div>
                    );
                  }

                  if (ext === 'pdf' || t.includes('pdf')) {
                    return (
                      <iframe 
                        src={previewUrl} 
                        title={previewFile.name}
                        style={{ width: '100%', height: '60vh', border: 'none', borderRadius: '8px', backgroundColor: '#fff' }} 
                      />
                    );
                  }

                  if (previewTextContent) {
                    return (
                      <pre style={{
                        width: '100%',
                        maxHeight: '60vh',
                        overflow: 'auto',
                        padding: '16px',
                        backgroundColor: '#111216',
                        color: '#a9b1d6',
                        fontFamily: '"JetBrains Mono", Fira Code, monospace',
                        fontSize: '13px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        textAlign: 'left',
                        whiteSpace: 'pre-wrap',
                        margin: 0
                      }}>
                        {previewTextContent}
                      </pre>
                    );
                  }

                  return (
                    <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                      <FileIcon size={48} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                      <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>In-browser preview not supported</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                        This file format ({ext.toUpperCase() || 'unknown'}) cannot be displayed directly inside the app.
                      </div>
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => handleDownload(previewFile)}
                        style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}
                      >
                        <Download size={14} />
                        Download to View
                      </button>
                    </div>
                  );
                })()
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Failed to load preview url.</div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => handleDownload(previewFile)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={14} />
                Download
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleClosePreview}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        marginTop: '64px',
        padding: '24px 0 12px',
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div>&copy; 2026 Shelby Upload. All rights reserved. Powered by Shelby Storage Network & Aptos Labs.</div>
        <div>Source code and files are decentralized, secure, and encrypted.</div>
      </footer>
    </div>
  );
}

export default App;
