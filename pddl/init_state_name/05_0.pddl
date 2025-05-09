(define (problem scene1)
  (:domain manip)
  (:objects
    tomato - item
    red onion - item
    purple eggplant - item
    small orange carrot - item
    water bottle - item
    big yellow shopping basket - container
  )
  (:init
    (ontable tomato)
    (ontable red onion)
    (ontable purple eggplant)
    (ontable small orange carrot)
    (ontable water bottle)
    (ontable big yellow shopping basket)
    (clear tomato)
    (clear red onion)
    (clear purple eggplant)
    (clear small orange carrot)
    (clear water bottle)
    (clear big yellow shopping basket)
    (handempty)
  )
  (:goal (and ))
)