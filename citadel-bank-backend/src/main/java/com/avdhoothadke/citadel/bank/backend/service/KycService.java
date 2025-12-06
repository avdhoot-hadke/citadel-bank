package com.avdhoothadke.citadel.bank.backend.service;

import com.avdhoothadke.citadel.bank.backend.entity.KycDocument;
import com.avdhoothadke.citadel.bank.backend.entity.KycStatus;
import com.avdhoothadke.citadel.bank.backend.entity.User;
import com.avdhoothadke.citadel.bank.backend.repository.KycRepository;
import com.avdhoothadke.citadel.bank.backend.repository.UserRepository;
import com.avdhoothadke.citadel.bank.backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class KycService {
    private final KycRepository kycRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final ActivityLogService activityLogService;

    public KycDocument uploadKyc(MultipartFile file, String documentType) {
        String username = SecurityUtils.getCurrentUsername();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        String fileUrl = fileStorageService.storeFile(file);

        KycDocument kyc = kycRepository.findByUser(user)
                .orElse(new KycDocument());

        kyc.setDocumentType(documentType);
        kyc.setDocumentUrl(fileUrl);
        kyc.setStatus(KycStatus.PENDING);
        kyc.setUser(user);

        KycDocument savedKyc = kycRepository.save(kyc);

        activityLogService.logAction(
                username,
                "KYC_UPLOADED",
                "Uploaded " + documentType + " document."
        );

        return savedKyc;
    }
    public Page<KycDocument> getPendingKycs(Pageable pageable) {
        return kycRepository.findByStatus(KycStatus.PENDING, pageable);
    }

    public KycDocument updateKycStatus(Long kycId, KycStatus newStatus) {
        KycDocument kyc = kycRepository.findById(kycId)
                .orElseThrow(() -> new RuntimeException("KYC Document not found"));

        kyc.setStatus(newStatus);
        return kycRepository.save(kyc);
    }

    public KycDocument getMyKyc() {
        String username = SecurityUtils.getCurrentUsername();
        User user = userRepository.findByUsername(username).orElseThrow();
        return kycRepository.findByUser(user).orElse(null);
    }
}
