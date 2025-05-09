(define (problem scene1)
  (:domain manip)
  (:objects
    mango - item
    yellow lemon - item
    tomato - item
    plastic knife - item
    paper clip - item
  )
  (:init
    (ontable mango)
    (ontable yellow lemon)
    (ontable tomato)
    (ontable paper clip)
    (on plastic knife tomato)
    (clear plastic knife)
    (clear mango)
    (clear yellow lemon)
    (clear paper clip)
    (handempty)
  )
  (:goal (and ))
)