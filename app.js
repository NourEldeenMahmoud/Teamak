// Global state
let allProfiles = [];
let filteredProfiles = [];
let displayedCount = 0;
const ITEMS_PER_PAGE = 12;
let selectedSkills = new Set();

// DOM elements
const searchInput = document.getElementById('searchInput');
const trackFilter = document.getElementById('trackFilter');
const advancedToggle = document.getElementById('advancedToggle');
const advancedFilters = document.getElementById('advancedFilters');
const skillsChips = document.getElementById('skillsChips');
const resultsGrid = document.getElementById('resultsGrid');
const resultsCount = document.getElementById('resultsCount');
const emptyState = document.getElementById('emptyState');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const profileModal = document.getElementById('profileModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');
const toast = document.getElementById('toast');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProfiles();
    setupEventListeners();
    handleDeepLinks();
});

// Load profiles from JSON
async function loadProfiles() {
    try {
        const response = await fetch('public/profiles.json');
        if (!response.ok) {
            throw new Error('Failed to load profiles');
        }
        allProfiles = await response.json();
        initializeSkillsFilter();
        applyFilters();
    } catch (error) {
        console.error('Error loading profiles:', error);
        resultsGrid.innerHTML = '<p style="text-align: center; color: #999;">خطأ في تحميل البيانات</p>';
    }
}

// Initialize skills filter chips
function initializeSkillsFilter() {
    // Collect all unique skills
    const allSkills = new Set();
    allProfiles.forEach(profile => {
        if (profile.skills && Array.isArray(profile.skills)) {
            profile.skills.forEach(skill => allSkills.add(skill));
        }
    });
    
    // Create chips
    skillsChips.innerHTML = '';
    Array.from(allSkills).sort().forEach(skill => {
        const chip = document.createElement('div');
        chip.className = 'skill-chip';
        chip.textContent = skill;
        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
            if (chip.classList.contains('active')) {
                selectedSkills.add(skill);
            } else {
                selectedSkills.delete(skill);
            }
            applyFilters();
        });
        skillsChips.appendChild(chip);
    });
}

// Setup event listeners
function setupEventListeners() {
    searchInput.addEventListener('input', applyFilters);
    trackFilter.addEventListener('change', applyFilters);
    
    advancedToggle.addEventListener('click', () => {
        advancedFilters.classList.toggle('hidden');
    });
    
    loadMoreBtn.addEventListener('click', () => {
        displayMore();
    });
    
    modalClose.addEventListener('click', () => {
        profileModal.classList.add('hidden');
    });
    
    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            profileModal.classList.add('hidden');
        }
    });
}

// Handle deep links from URL
function handleDeepLinks() {
    const params = new URLSearchParams(window.location.search);
    
    // Handle ?telegram_id=... - highlight specific profile
    const telegramId = params.get('telegram_id');
    if (telegramId) {
        // Wait for profiles to load, then scroll to and highlight
        setTimeout(() => {
            const profileCard = document.querySelector(`[data-telegram-id="${telegramId}"]`);
            if (profileCard) {
                profileCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                profileCard.classList.add('highlighted');
                // Open modal after a short delay
                setTimeout(() => {
                    openModal(parseInt(telegramId));
                }, 500);
            }
        }, 500);
    }
    
    // Handle ?q=...&track=... - pre-fill search and filter
    const query = params.get('q');
    const track = params.get('track');
    
    if (query) {
        searchInput.value = query;
    }
    if (track) {
        trackFilter.value = track;
    }
    
    if (query || track) {
        // Apply filters after a short delay to ensure profiles are loaded
        setTimeout(() => {
            applyFilters();
        }, 300);
    }
}

// Apply filters and search
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedTrack = trackFilter.value;
    
    filteredProfiles = allProfiles.filter(profile => {
        // Search filter
        if (searchTerm) {
            const nameMatch = profile.name.toLowerCase().includes(searchTerm);
            const bioMatch = profile.bio.toLowerCase().includes(searchTerm);
            const skillsMatch = profile.skills && profile.skills.some(skill => 
                skill.toLowerCase().includes(searchTerm)
            );
            const interestsMatch = profile.interests && profile.interests.some(interest => 
                interest.toLowerCase().includes(searchTerm)
            );
            
            if (!nameMatch && !bioMatch && !skillsMatch && !interestsMatch) {
                return false;
            }
        }
        
        // Track filter
        if (selectedTrack && profile.track !== selectedTrack) {
            return false;
        }
        
        // Skills filter
        if (selectedSkills.size > 0) {
            const profileSkills = profile.skills || [];
            const hasSelectedSkill = Array.from(selectedSkills).some(skill =>
                profileSkills.includes(skill)
            );
            if (!hasSelectedSkill) {
                return false;
            }
        }
        
        return true;
    });
    
    displayedCount = 0;
    resultsGrid.innerHTML = '';
    updateResultsCount();
    displayMore();
}

// Display more profiles
function displayMore() {
    const toDisplay = filteredProfiles.slice(displayedCount, displayedCount + ITEMS_PER_PAGE);
    
    toDisplay.forEach(profile => {
        const card = createProfileCard(profile);
        resultsGrid.appendChild(card);
    });
    
    displayedCount += toDisplay.length;
    
    // Show/hide load more button
    if (displayedCount >= filteredProfiles.length) {
        loadMoreBtn.classList.add('hidden');
        if (filteredProfiles.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
    } else {
        loadMoreBtn.classList.remove('hidden');
        emptyState.classList.add('hidden');
    }
}

// Create profile card element
function createProfileCard(profile) {
    const card = document.createElement('div');
    card.className = 'profile-card';
    card.setAttribute('data-telegram-id', profile.telegram_id);
    card.addEventListener('click', () => openModal(profile.telegram_id));
    
    // Name
    const name = document.createElement('div');
    name.className = 'card-name';
    name.textContent = profile.name;
    card.appendChild(name);
    
    // Track
    const track = document.createElement('span');
    track.className = 'card-track';
    track.textContent = profile.track;
    card.appendChild(track);
    
    // Bio
    const bio = document.createElement('div');
    bio.className = 'card-bio';
    bio.textContent = profile.bio;
    card.appendChild(bio);
    
    // Links
    const linksDiv = document.createElement('div');
    linksDiv.className = 'card-links';
    if (profile.links && profile.links.length > 0) {
        profile.links.slice(0, 3).forEach(link => {
            const linkBtn = createLinkButton(link);
            linksDiv.appendChild(linkBtn);
        });
    }
    card.appendChild(linksDiv);
    
    // Skills (max 5)
    if (profile.skills && profile.skills.length > 0) {
        const skillsDiv = document.createElement('div');
        skillsDiv.className = 'card-skills';
        const skillsToShow = profile.skills.slice(0, 5);
        skillsToShow.forEach(skill => {
            const tag = document.createElement('span');
            tag.className = 'skill-tag';
            tag.textContent = skill;
            skillsDiv.appendChild(tag);
        });
        if (profile.skills.length > 5) {
            const more = document.createElement('span');
            more.className = 'skill-more';
            more.textContent = `+${profile.skills.length - 5}`;
            skillsDiv.appendChild(more);
        }
        card.appendChild(skillsDiv);
    }
    
    // Contact
    const contactDiv = document.createElement('div');
    contactDiv.className = 'card-contact';
    const contactBtn = document.createElement('button');
    contactBtn.className = 'contact-btn';
    contactBtn.textContent = 'تواصل';
    contactBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleContact(profile.contact);
    });
    contactDiv.appendChild(contactBtn);
    card.appendChild(contactDiv);
    
    return card;
}

// Create link button with icon detection
function createLinkButton(url) {
    const linkBtn = document.createElement('a');
    linkBtn.href = url;
    linkBtn.target = '_blank';
    linkBtn.rel = 'noopener noreferrer';
    linkBtn.className = 'link-btn';
    
    const hostname = new URL(url).hostname.toLowerCase();
    let iconText = '🔗';
    
    if (hostname.includes('github')) {
        iconText = '💻';
    } else if (hostname.includes('linkedin')) {
        iconText = '💼';
    } else if (hostname.includes('portfolio') || hostname.includes('personal')) {
        iconText = '🌐';
    }
    
    linkBtn.textContent = iconText + ' ' + getLinkLabel(hostname);
    return linkBtn;
}

// Get link label from hostname
function getLinkLabel(hostname) {
    if (hostname.includes('github')) return 'GitHub';
    if (hostname.includes('linkedin')) return 'LinkedIn';
    if (hostname.includes('portfolio') || hostname.includes('personal')) return 'Portfolio';
    return 'Link';
}

// Handle contact button click
function handleContact(contact) {
    if (contact.startsWith('@')) {
        // Telegram username - open t.me link
        const username = contact.substring(1);
        window.open(`https://t.me/${username}`, '_blank');
    } else {
        // Copy to clipboard
        navigator.clipboard.writeText(contact).then(() => {
            showToast();
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('اتنسخ: ' + contact);
        });
    }
}

// Show toast notification
function showToast() {
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2000);
}

// Open modal with profile details
function openModal(telegramId) {
    const profile = allProfiles.find(p => p.telegram_id === telegramId);
    if (!profile) return;
    
    modalBody.innerHTML = '';
    
    // Name
    const name = document.createElement('div');
    name.className = 'modal-name';
    name.textContent = profile.name;
    modalBody.appendChild(name);
    
    // Track
    const track = document.createElement('span');
    track.className = 'modal-track';
    track.textContent = profile.track;
    modalBody.appendChild(track);
    
    // Bio
    const bio = document.createElement('div');
    bio.className = 'modal-bio';
    bio.textContent = profile.bio;
    modalBody.appendChild(bio);
    
    // Links
    if (profile.links && profile.links.length > 0) {
        const linksSection = document.createElement('div');
        linksSection.className = 'modal-section';
        const linksTitle = document.createElement('h3');
        linksTitle.textContent = 'اللينكات';
        linksSection.appendChild(linksTitle);
        const linksDiv = document.createElement('div');
        linksDiv.className = 'modal-links';
        profile.links.forEach(link => {
            const linkBtn = createLinkButton(link);
            linkBtn.style.width = '100%';
            linkBtn.style.justifyContent = 'center';
            linksDiv.appendChild(linkBtn);
        });
        linksSection.appendChild(linksDiv);
        modalBody.appendChild(linksSection);
    }
    
    // Skills
    if (profile.skills && profile.skills.length > 0) {
        const skillsSection = document.createElement('div');
        skillsSection.className = 'modal-section';
        const skillsTitle = document.createElement('h3');
        skillsTitle.textContent = 'المهارات';
        skillsSection.appendChild(skillsTitle);
        const skillsDiv = document.createElement('div');
        skillsDiv.className = 'modal-skills';
        profile.skills.forEach(skill => {
            const tag = document.createElement('span');
            tag.className = 'skill-tag';
            tag.textContent = skill;
            skillsDiv.appendChild(tag);
        });
        skillsSection.appendChild(skillsDiv);
        modalBody.appendChild(skillsSection);
    }
    
    // Interests
    if (profile.interests && profile.interests.length > 0) {
        const interestsSection = document.createElement('div');
        interestsSection.className = 'modal-section';
        const interestsTitle = document.createElement('h3');
        interestsTitle.textContent = 'الاهتمامات';
        interestsSection.appendChild(interestsTitle);
        const interestsDiv = document.createElement('div');
        interestsDiv.className = 'modal-interests';
        profile.interests.forEach(interest => {
            const tag = document.createElement('span');
            tag.className = 'skill-tag';
            tag.textContent = interest;
            interestsDiv.appendChild(tag);
        });
        interestsSection.appendChild(interestsDiv);
        modalBody.appendChild(interestsSection);
    }
    
    // Contact
    const contactSection = document.createElement('div');
    contactSection.className = 'modal-section';
    const contactTitle = document.createElement('h3');
    contactTitle.textContent = 'التواصل';
    contactSection.appendChild(contactTitle);
    const contactDiv = document.createElement('div');
    contactDiv.className = 'modal-contact';
    const contactBtn = document.createElement('button');
    contactBtn.className = 'contact-btn';
    contactBtn.style.width = '100%';
    if (profile.contact.startsWith('@')) {
        contactBtn.textContent = 'افتح على تليجرام: ' + profile.contact;
    } else {
        contactBtn.textContent = 'انسخ: ' + profile.contact;
    }
    contactBtn.addEventListener('click', () => handleContact(profile.contact));
    contactDiv.appendChild(contactBtn);
    contactSection.appendChild(contactDiv);
    modalBody.appendChild(contactSection);
    
    profileModal.classList.remove('hidden');
}

// Update results count
function updateResultsCount() {
    resultsCount.textContent = `عدد النتائج: ${filteredProfiles.length}`;
}
