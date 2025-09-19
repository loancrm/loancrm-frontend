import { Component } from '@angular/core';
import { LeadsService } from '../leads/leads.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  walletEnabled: boolean = false; // default

  constructor(private walletService: LeadsService) { }

  ngOnInit(): void {
    // Fetch wallet status from backend
    this.walletService.getWalletStatus().subscribe({
      next: (res) => {
        this.walletEnabled = res.status === 'active';
      },
      error: (err) => {
        console.error('Failed to fetch wallet status', err);
      },
    });
  }

  toggleWallet(event: any) {
    const newStatus = event.checked ? 'active' : 'inactive';

    this.walletService.updateWalletStatus(newStatus).subscribe({
      next: () => {
        this.walletEnabled = newStatus === 'active';
      },
      error: (err) => {
        console.error('Failed to update wallet status', err);
      },
    });
  }
}
