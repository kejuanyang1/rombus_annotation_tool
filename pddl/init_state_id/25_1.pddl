(define (problem scene1)
  (:domain manip)
  (:objects
    office_02 - item
    office_05 - item
    office_08 - item
    container_05 - container
  )
  (:init
    (in office_02 container_05)
    (ontable office_05)
    (ontable office_08)
    (clear office_05)
    (clear office_08)
    (handempty)
  )
  (:goal (and ))
)