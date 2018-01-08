import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Trainee } from '../../entities/Trainee';
import { Batch } from '../../entities/Batch';

/**
 * Service that handles report granularity. Trainee and current batch
 * data is stored in their respective behavior subjects and read by
 * observables. New trainees and batches can be pushed to these subjects
 * through use of exposed functions.
 *
 * @author Micah West
 */

@Injectable()
export class GranularityService {

  /* Subjects & Paired Observables */
  private currentBatch = new ReplaySubject<Batch>(1);
  private currentTrainee = new ReplaySubject<Trainee>(1);
  private currentWeek = new ReplaySubject<number>(1);
  private ready = new ReplaySubject<boolean>(1);

  public currentBatch$ = this.currentBatch.asObservable();
  public currentTrainee$ = this.currentTrainee.asObservable();
  public currentWeek$ = this.currentWeek.asObservable();
  public ready$ = this.ready.asObservable();

  constructor() {
    /*   Default values used for testing   */
/*
    // this is an actual batch from api
    const sampleBatch = {
      'batchId': 2201, 'resourceId': null, 'trainingName': '1702 Feb13 Java (AP)',
      'trainer': {
        'trainerId': 1, 'name': 'Patrick Walsh', 'title': 'Lead Trainer',
        'email': 'patrick.walsh@revature.com', 'tier': 'ROLE_VP'
      },
      'coTrainer': null, 'skillType': 'J2EE', 'trainingType': 'University',
      'startDate': new Date('2017-02-13'), 'endDate': new Date('2017-12-19'),
      'location': 'Tech Incubator at Queens College, 65-30 Kissena Blvd, CEP Hall 2, Queens, NY 11367',
      'address': {
        'addressId': 1, 'street': '65-30 Kissena Blvd, CEP Hall 2', 'city': 'Queens', 'state': 'NY',
        'zipcode': '11367', 'company': 'Tech Incubator at Queens College', 'active': true
      },
      'goodGradeThreshold': 80, 'borderlineGradeThreshold': 70,
      'trainees': [
        {
          'traineeId': 5531, 'resourceId': null, 'name': 'Lam, Kam', 'email': 'kamlam@live.com',
          'trainingStatus': 'Training', 'phoneNumber': '917-951-1138', 'skypeId': 'live:89f575098655f2b',
          'profileUrl': 'https://app.revature.com/profile/Kamlam02/0b64db75d34cddd8b96f8091e44d57b7',
          'recruiterName': null, 'college': null, 'degree': null, 'major': null, 'techScreenerName': null,
          'projectCompletion': null, batch: null
        },
        {
          'traineeId': 5528, 'resourceId': null, 'name': 'Yahya, Hossain', 'email': 'hossain.yahya@outlook.com',
          'trainingStatus': 'Employed', 'phoneNumber': '347-595-0959', 'skypeId': 'live:hossain.yahya_1',
          'profileUrl': 'https://app.revature.com/profile/Hossain/56533488cfec931bbc8e43ba02f12190',
          'recruiterName': null, 'college': null, 'degree': null, 'major': null, 'techScreenerName': null,
          'projectCompletion': null, batch: null
        },
        {
          'traineeId': 5535, 'resourceId': null, 'name': 'Itwaru, Sudish', 'email': 'suditw@gmail.com',
          'trainingStatus': 'Employed', 'phoneNumber': '718-415-0517', 'skypeId': 'sudish.itwaru',
          'profileUrl': 'https://app.revature.com/profile/sitwaru/8995f5191fdba7a3508ed6e9825863e1',
          'recruiterName': null, 'college': null, 'degree': null, 'major': null, 'techScreenerName': null,
          'projectCompletion': null, batch: null
        },
        {
          'traineeId': 5526, 'resourceId': null, 'name': 'Duong, Jack', 'email': 'son.jack0218@gmail.com',
          'trainingStatus': 'Employed', 'phoneNumber': '(646) 417-3976', 'skypeId': 'imrjack',
          'profileUrl': 'https://app.revature.com/profile/imrjack/fab72b5d62b5965bcd22aabe0a9ee24b',
          'recruiterName': null, 'college': null, 'degree': null, 'major': null, 'techScreenerName': null,
          'projectCompletion': null, batch: null
        },
        {
          'traineeId': 5527, 'resourceId': null, 'name': 'Valcin, Hendy', 'email': 'hvalcin.grady@gmail.com',
          'trainingStatus': 'Employed', 'phoneNumber': '347-272-0040', 'skypeId': 'live:196c1fe19236d6c6',
          'profileUrl': 'https://app.revature.com/profile/Hendy/4991db30a308e99aff23eead11daa716',
          'recruiterName': null, 'college': null, 'degree': null, 'major': null, 'techScreenerName': null,
          'projectCompletion': null, batch: null
        },
        {
          'traineeId': 5532, 'resourceId': null, 'name': 'Ahmed, Sadat', 'email': 'sadat.t.ahmed@gmail.com',
          'trainingStatus': 'Employed', 'phoneNumber': '646-407-7707', 'skypeId': 'sadat.t.ahmed',
          'profileUrl': 'https://app.revature.com/profile/SadatAhmed/9b198abd1d0d88022d593375b61ed041',
          'recruiterName': null, 'college': null, 'degree': null, 'major': null, 'techScreenerName': null,
          'projectCompletion': null, batch: null
        },
        {
          'traineeId': 5538, 'resourceId': null, 'name': 'Connelly, Sean', 'email': 'connelsp@gmail.com',
          'trainingStatus': 'Employed', 'phoneNumber': '718-772-1455', 'skypeId': 'seanelly08',
          'profileUrl': 'https://app.revature.com/profile/Seanelly/64c09ac289741de8bf7ec0f81f2ad5ad',
          'recruiterName': null, 'college': null, 'degree': null, 'major': null, 'techScreenerName': null,
          'projectCompletion': null, batch: null
        },
        {
          'traineeId': 5533, 'resourceId': null, 'name': 'Yos, Pier', 'email': 'pieryospp@gmail.com',
          'trainingStatus': 'Employed', 'phoneNumber': '347-238-4965', 'skypeId': 'pieryospp',
          'profileUrl': 'https://app.revature.com/profile/Peacepapi/22e027610567ad08a4c6698a8dbfa74b',
          'recruiterName': null, 'college': null, 'degree': null, 'major': null, 'techScreenerName': null,
          'projectCompletion': null, batch: null
        },
        {
          'traineeId': 5539, 'resourceId': null, 'name': 'Gluskin, Igor', 'email': 'igorgluskin@yahoo.com',
          'trainingStatus': 'Employed', 'phoneNumber': '347-791-1360', 'skypeId': 'igor.gluskin',
          'profileUrl': 'https://app.revature.com/profile/IgorGluskin/ae6866d406461c1c36de8df7c0a1a7a7',
          'recruiterName': null, 'college': null, 'degree': null, 'major': null, 'techScreenerName': null,
          'projectCompletion': null, batch: null
        },
        {
          'traineeId': 5537, 'resourceId': null, 'name': 'Guan, Kevin', 'email': 'guankev@gmail.com',
          'trainingStatus': 'Employed', 'phoneNumber': '347-447-1888', 'skypeId': 'live:kevguan',
          'profileUrl': 'https://app.revature.com/profile/KevinG92/2ba062861641fbf4e956c517983952c4',
          'recruiterName': null, 'college': null, 'degree': null, 'major': null, 'techScreenerName': null,
          'projectCompletion': null, batch: null
        },
        {
          'traineeId': 5524, 'resourceId': null, 'name': 'Cartagena, Michael', 'email': 'mcartagenaez8@gmail.com',
          'trainingStatus': 'Employed', 'phoneNumber': '347-782-4731', 'skypeId': 'mcart5566',
          'profileUrl': 'https://app.revature.com/profile/MichaelC/55b6b9a398dacdb90093a3088822d35c',
          'recruiterName': null, 'college': null, 'degree': null, 'major': null, 'techScreenerName': null,
          'projectCompletion': null, batch: null
        },
        {
          'traineeId': 5525, 'resourceId': null, 'name': 'Peralta, Yanilda', 'email': 'tanland20@gmail.com',
          'trainingStatus': 'Employed', 'phoneNumber': '347-638-1605', 'skypeId': 'eclipsesunsettreesynch',
          'profileUrl': 'https://app.revature.com/profile/Synac/254a7187dfc32f6f50710a56bd8112f6',
          'recruiterName': null, 'college': null, 'degree': null, 'major': null, 'techScreenerName': null,
          'projectCompletion': null, batch: null
        },
        {
          'traineeId': 5529, 'resourceId': null, 'name': 'Montesdeoca, Denise', 'email': 'denise.j.montesdeoca@gmail.com',
          'trainingStatus': 'Employed', 'phoneNumber': '347-536-7727', 'skypeId': 'live:55f3683c5bb7165c',
          'profileUrl': 'https://app.revature.com/profile/dmontesdeoca/4ddfb0697a3c1fff8d16e6a1ce46348c',
          'recruiterName': null, 'college': null, 'degree': null, 'major': null, 'techScreenerName': null,
          'projectCompletion': null, batch: null
        },
        {
          'traineeId': 5536, 'resourceId': null, 'name': 'Liu, Daniel', 'email': 'danliu277@gmail.com',
          'trainingStatus': 'Employed', 'phoneNumber': '646-275-2027', 'skypeId': 'danliu277',
          'profileUrl': 'https://app.revature.com/profile/DanielLiu/8ec745c0558385ae50ac8c25324d7bb3',
          'recruiterName': null, 'college': null, 'degree': null, 'major': null, 'techScreenerName': null,
          'projectCompletion': null, batch: null
        },
        {
          'traineeId': 5534, 'resourceId': null, 'name': 'Khawaja, Ateeb', 'email': 'ateebtahir@gmail.com',
          'trainingStatus': 'Employed', 'phoneNumber': '347-251-9865', 'skypeId': 'ateebtahir',
          'profileUrl': 'https://app.revature.com/profile/KMAT/eab7a80a000dc662a9c098b80259c013',
          'recruiterName': null, 'college': null, 'degree': null, 'major': null, 'techScreenerName': null,
          'projectCompletion': null, batch: null
        },
        {
          'traineeId': 5530, 'resourceId': null, 'name': 'Ali, Fareed', 'email': 'fareed.ali37@qmail.cuny.edu',
          'trainingStatus': 'Employed', 'phoneNumber': '347-526-5184', 'skypeId': 'live:bassph',
          'profileUrl': 'https://app.revature.com/profile/fareed/03198a1e81a3f4e32433a9e9c9db353e',
          'recruiterName': null, 'college': null, 'degree': null, 'major': null, 'techScreenerName': null,
          'projectCompletion': null, batch: null
        }],
      'weeks': 7, 'gradedWeeks': 7
    };
    const testBatch: Batch = sampleBatch;

    this.currentBatch.next(testBatch);

    const testTrainee: Trainee = {
      'traineeId': 5530, 'resourceId': null, 'name': 'Ali, Fareed', 'email': 'fareed.ali37@qmail.cuny.edu',
      'trainingStatus': 'Employed', 'phoneNumber': '347-526-5184', 'skypeId': 'live:bassph',
      'profileUrl': 'https://app.revature.com/profile/fareed/03198a1e81a3f4e32433a9e9c9db353e',
      'recruiterName': null, 'college': null, 'degree': null, 'major': null, 'techScreenerName': null,
      'projectCompletion': null, batch: null
    };
    this.currentTrainee.next(testTrainee);

    const week = 4;
    this.currentWeek.next(week);
    */
  }

  /*
  =================================
            PUSH METHODS
  =================================
  */

  /**
   * Pushes the specified trainee to the currentTrainee subject.
   * @param trainee - Trainee to push to the subject.
   */
  pushTrainee(trainee: Trainee) {
    this.currentTrainee.next(trainee);
  }

  /**
   * Pushes the specified batch to the currentBatch subject.
   * @param batch - Batch to push to the subject.
   */
  pushBatch(batch: Batch) {
    this.currentBatch.next(batch);
  }

  /**
   * Pushes the specified week number to the currentWeek subject.
   * @param week - Week number to push to the subject.
   */
  pushWeek(week: number) {
    this.currentWeek.next(week);
  }

  /**
   * Pushes a specified ready state to the ready subject.
   * This value is used to destroy the view when multiple state changes
   * are required.
   * @param ready - boolean ready state
   */
  pushReady(ready: boolean) {
    this.ready.next(ready);
  }
}
